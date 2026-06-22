import { FULL_API_BASE_URL } from './environment';
import { getToken } from './storage';

/**
 * 业务请求配置。
 *
 * auth 默认是 true：除了登录、登录配置等公开接口，业务接口都应该自动带 token。
 * 这样新增接口时更不容易漏掉 Authorization。
 */
interface RequestConfig {
  auth?: boolean;
}

/**
 * 登录过期错误。
 *
 * 单独定义错误类型，是为了让调用方可以区分：
 * - AuthExpiredError：需要清登录态并回登录页
 * - 普通 Error：只展示业务错误或网络错误
 */
export class AuthExpiredError extends Error {
  constructor(message = '登录已过期，请重新登录') {
    super(message);
    this.name = 'AuthExpiredError';
  }
}

/**
 * 401 回调由 AuthContext 注册。
 *
 * request.ts 属于 services 层，不应该直接依赖 React Context 或 navigation。
 * 用注册回调的方式，可以让请求层发现 401 后通知上层处理登录态，同时保持模块边界清晰。
 */
let unauthorizedHandler: (() => void | Promise<void>) | null = null;

export function setUnauthorizedHandler(handler: (() => void | Promise<void>) | null): void {
  unauthorizedHandler = handler;
}

/**
 * 触发 401 处理。
 *
 * 这里故意吞掉 handler 自身的异常：请求失败已经会通过 AuthExpiredError 反馈给业务调用方，
 * 过期清理失败不应该再覆盖原始的 401 语义。
 */
async function notifyUnauthorized(): Promise<void> {
  try {
    await unauthorizedHandler?.();
  } catch {
    // 忽略清理回调异常，避免掩盖当前请求的登录过期错误。
  }
}

/**
 * 将调用方传入的 headers 规整成普通对象，方便追加 Authorization。
 *
 * React Native fetch 常见用法是传入普通对象；这里也兼容 Headers 实例和二维数组写法。
 */
function normalizeHeaders(headers?: RequestInit['headers']): Record<string, string> {
  if (!headers) {
    return {};
  }

  if (headers instanceof Headers) {
    const normalizedHeaders: Record<string, string> = {};
    headers.forEach((value, key) => {
      normalizedHeaders[key] = value;
    });
    return normalizedHeaders;
  }

  if (Array.isArray(headers)) {
    return headers.reduce<Record<string, string>>((result, [key, value]) => {
      result[key] = value;
      return result;
    }, {});
  }

  return headers as Record<string, string>;
}

/**
 * 统一请求入口。
 *
 * 这个函数集中处理四件事：
 * 1. 拼接 API 基础路径，避免各接口重复写 FULL_API_BASE_URL。
 * 2. 默认补 Content-Type，保持 JSON 请求一致。
 * 3. 需要鉴权时自动读取 token 并添加 Authorization。
 * 4. 统一识别 HTTP 401，并通知 AuthContext 清理登录态。
 */
export async function request<T>(
  path: string,
  options: RequestInit = {},
  config: RequestConfig = {},
): Promise<T> {
  const shouldAttachAuth = config.auth !== false;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...normalizeHeaders(options.headers),
  };

  if (shouldAttachAuth) {
    const token = await getToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${FULL_API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    await notifyUnauthorized();
    throw new AuthExpiredError();
  }

  if (!response.ok) {
    throw new Error(`请求失败：${response.status}`);
  }

  return response.json() as Promise<T>;
}
