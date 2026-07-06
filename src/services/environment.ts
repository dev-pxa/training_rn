import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 开发者调试页当前允许在固定接口环境和自定义环境之间切换。
 *
 * 注意：原型里的“调试表单”暂时只做 UI 展示，不参与请求参数、Mock、日志等逻辑。
 * 因此这里的运行时配置只保存接口环境，后续如果表单需要生效，再扩展这个类型即可。
 */
export type ApiEnvironment = 'test' | 'mock' | 'production' | 'custom';

/**
 * 真正会被请求层读取的运行时环境快照。
 *
 * env 用于页面回显当前选中项；apiBaseUrl 用于 request.ts 和证书图片相对路径拼接。
 * 两者一起保存，是为了避免后续域名调整时页面显示和实际请求域名不一致。
 */
export interface RuntimeEnvironmentConfig {
  env: ApiEnvironment;
  apiBaseUrl: string;
}

/**
 * 页面展示用的环境选项。
 *
 * label/badge 只用于开发者调试页展示；业务请求只依赖 RuntimeEnvironmentConfig。
 */
export interface ApiEnvironmentOption extends RuntimeEnvironmentConfig {
  label: string;
  badge: string;
}

/**
 * 单独使用一个 key 保存调试环境，避免和登录态 train_rn_auth 混在一起。
 * 这样退出登录只清鉴权数据，不会清掉开发者手动选择的接口环境。
 */
const ENVIRONMENT_STORAGE_KEY = 'train_rn_runtime_environment';

// API 路径前缀
export const API_PATH_PREFIX = '/api/app';

/**
 * 默认和兜底都走 DEFAULT_ENVIRONMENT 对应的环境。
 *
 * 如果设备没有保存过环境配置，或者 AsyncStorage 读取失败、解析失败、
 * 存储内容缺少有效 url，都会回到这个默认环境，避免请求层拿到空域名。
 */
export const DEFAULT_ENVIRONMENT: ApiEnvironment = 'test';

/**
 * 固定环境清单。
 *
 * 测试环境沿用项目现有真实测试接口，mock/生产/自定义在这里统一声明。
 * 后续如果后端提供新的域名，只需要替换对应项的 apiBaseUrl。
 */
export const API_ENVIRONMENT_OPTIONS: Record<ApiEnvironment, ApiEnvironmentOption> = {
  mock: {
    env: 'mock',
    label: 'mock环境',
    badge: 'mock',
    apiBaseUrl: 'https://m1.apifoxmock.com/m1/8000488-7754565-default',
  },
  test: {
    env: 'test',
    label: '测试环境',
    badge: '当前',
    apiBaseUrl: 'http://49.232.34.105:8082',
  },
  production: {
    env: 'production',
    label: '生产环境',
    badge: '线上',
    apiBaseUrl: 'https://api.qixuntong.com',
  },
  custom: {
    env: 'custom',
    label: '自定义环境',
    badge: '自定义',
    apiBaseUrl: '',
  },
};

const FALLBACK_ENVIRONMENT_CONFIG: RuntimeEnvironmentConfig = {
  env: DEFAULT_ENVIRONMENT,
  apiBaseUrl: API_ENVIRONMENT_OPTIONS[DEFAULT_ENVIRONMENT].apiBaseUrl,
};

/**
 * 统一去掉域名末尾的斜杠。
 *
 * request.ts 会固定拼接 API_PATH_PREFIX，如果保存的域名以 / 结尾，
 * 不规整会产生 https://host.com//api/app 这种双斜杠地址。
 */
function normalizeBaseUrl(apiBaseUrl: string): string {
  return apiBaseUrl.trim().replace(/\/+$/, '');
}

/**
 * 运行时读取的是设备本地 JSON，不能相信里面的 env 一定合法。
 * 用类型守卫把未知值收窄成 ApiEnvironment，避免非法字符串进入请求配置。
 */
function isApiEnvironment(value: unknown): value is ApiEnvironment {
  return value === 'test' || value === 'mock' || value === 'production' || value === 'custom';
}

/**
 * 把本地存储中的原始配置解析成可用配置。
 *
 * 这里的兜底策略故意偏保守：只要 env 不合法或 apiBaseUrl 为空，就整体回到默认环境。
 * 这样即使本地数据损坏，也不会把空域名继续传给请求层。
 */
function resolveEnvironmentConfig(config: Partial<RuntimeEnvironmentConfig> | null | undefined): RuntimeEnvironmentConfig {
  const normalizedUrl = typeof config?.apiBaseUrl === 'string' ? normalizeBaseUrl(config.apiBaseUrl) : '';

  if (!config || !isApiEnvironment(config.env) || !normalizedUrl) {
    return FALLBACK_ENVIRONMENT_CONFIG;
  }

  return {
    env: config.env,
    apiBaseUrl: normalizedUrl,
  };
}

export function getDefaultEnvironmentConfig(): RuntimeEnvironmentConfig {
  return FALLBACK_ENVIRONMENT_CONFIG;
}

/**
 * 保存开发者调试页选择的接口环境。
 *
 * 当前只保存接口环境和自定义环境域名，不保存调试表单字段，
 * 因为需求明确说明表单部分暂时只实现 UI 展示。
 * 返回保存后的配置，方便页面直接拿 label 做 Toast 文案。
 */
export async function saveEnvironmentConfig(env: ApiEnvironment, customApiBaseUrl?: string): Promise<RuntimeEnvironmentConfig> {
  const option = API_ENVIRONMENT_OPTIONS[env] ?? API_ENVIRONMENT_OPTIONS[DEFAULT_ENVIRONMENT];
  const apiBaseUrl = env === 'custom' ? customApiBaseUrl ?? '' : option.apiBaseUrl;
  const config: RuntimeEnvironmentConfig = {
    env: option.env,
    apiBaseUrl: normalizeBaseUrl(apiBaseUrl),
  };

  await AsyncStorage.setItem(ENVIRONMENT_STORAGE_KEY, JSON.stringify(config));

  return config;
}

export async function loadEnvironmentConfig(): Promise<RuntimeEnvironmentConfig> {
  try {
    const serializedConfig = await AsyncStorage.getItem(ENVIRONMENT_STORAGE_KEY);

    if (!serializedConfig) {
      /**
       * 设备从未保存过调试环境时，直接使用线上环境。
       * 这是冷启动和首次安装后的默认路径。
       */
      return FALLBACK_ENVIRONMENT_CONFIG;
    }

    return resolveEnvironmentConfig(JSON.parse(serializedConfig) as Partial<RuntimeEnvironmentConfig>);
  } catch {
    /**
     * AsyncStorage 异常、JSON 损坏或结构不符合预期时，不能阻断请求流程。
     * 这类失败统一回落到默认环境域名。
     */
    return FALLBACK_ENVIRONMENT_CONFIG;
  }
}

/**
 * 给需要拼接非 API 资源的模块使用，例如证书图片相对路径。
 * 即使 loadEnvironmentConfig 未来改动，这里仍保留一次空值兜底，保证调用方拿到可拼接的域名。
 */
export async function getApiBaseUrl(): Promise<string> {
  const config = await loadEnvironmentConfig();
  return config.apiBaseUrl || FALLBACK_ENVIRONMENT_CONFIG.apiBaseUrl;
}

/**
 * 给统一请求层使用的完整 API 前缀。
 * 这里每次调用都读取运行时配置，确保用户在开发者调试页保存后，新请求立即使用新环境。
 */
export async function getFullApiBaseUrl(): Promise<string> {
  const apiBaseUrl = await getApiBaseUrl();
  return `${apiBaseUrl}${API_PATH_PREFIX}`;
}
