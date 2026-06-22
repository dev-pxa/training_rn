import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginResponse } from '../types/login';

/**
 * 统一管理本地鉴权数据的 key。
 *
 * 这里不要把 token 和 user 拆成多个 key：
 * 1. 登录态恢复时需要两者同时存在，单 key 可以避免“token 写成功、user 写失败”的半登录状态。
 * 2. 后续如果要做版本迁移，也只需要迁移一个结构化对象。
 */
const AUTH_STORAGE_KEY = 'train_rn_auth';

/**
 * App 内使用的鉴权数据结构。
 *
 * 目前后端登录响应刚好就是 { token, user }，所以直接复用 LoginResponse。
 * 单独声明别名是为了让 storage 的职责更清楚：它只关心“可持久化的鉴权快照”。
 */
export type AuthStorageData = LoginResponse;

/**
 * 将登录态保存到设备本地。
 *
 * 注意：AsyncStorage 是异步 IO，可能因为磁盘空间、原生模块异常、JSON 序列化异常等原因失败。
 * 因此调用方必须 await 这个函数；只有保存并校验成功后，才应该把用户切到已登录状态。
 */
export async function saveAuthData(data: AuthStorageData): Promise<void> {
  const serializedAuthData = JSON.stringify(data);

  await AsyncStorage.setItem(AUTH_STORAGE_KEY, serializedAuthData);

  /**
   * 写后读校验。
   *
   * 正常情况下 setItem 失败会直接 reject，但为了防止极端情况下“Promise 成功、实际没写进去”
   * 或“写入后被异常覆盖”，这里立刻读回同一个 key 做一次强校验。
   * 如果读回内容和刚写入的字符串不一致，就主动抛错，让登录流程停在登录页。
   */
  const savedAuthData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

  if (savedAuthData !== serializedAuthData) {
    throw new Error('登录状态保存失败，请重试');
  }
}

/**
 * 从本地恢复登录态。
 *
 * 返回 null 表示当前没有可用登录态。这里会主动校验 token 和 user 是否都存在：
 * 只要结构不完整，就视为无效数据并清理，避免 App 进入“看似已登录但请求无法鉴权”的状态。
 */
export async function loadAuthData(): Promise<AuthStorageData | null> {
  try {
    const serializedAuthData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

    if (!serializedAuthData) {
      return null;
    }

    const authData = JSON.parse(serializedAuthData) as Partial<AuthStorageData>;

    if (!authData.token || !authData.user) {
      try {
        await clearAuthData();
      } catch {
        // 清理失败不阻塞启动流程；调用方拿到 null 后会进入未登录态。
      }
      return null;
    }

    return authData as AuthStorageData;
  } catch {
    /**
     * 读取或解析失败通常意味着本地数据不可用。
     * 这里选择清理坏数据，而不是继续保留它反复触发启动异常。
     */
    try {
      await clearAuthData();
    } catch {
      // 即使清理失败，也返回 null，避免 AuthProvider 一直停留在 initializing。
    }
    return null;
  }
}

/**
 * 获取当前持久化 token。
 *
 * 这里读 AsyncStorage，是因为请求层是普通 service，不能直接使用 React Context 里的内存 token。
 * 请求层会在每次需要鉴权的接口发起前调用它，确保 App 重启后也能从本地拿到 token。
 * 如果读取失败或数据不完整，loadAuthData 会返回 null，请求层就不会带 Authorization。
 */
export async function getToken(): Promise<string | null> {
  const authData = await loadAuthData();
  return authData?.token ?? null;
}

/**
 * 清除本地登录态。
 *
 * 退出登录、token 过期、本地数据损坏时都走这一条路径，保证清理行为一致。
 */
export async function clearAuthData(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
}
