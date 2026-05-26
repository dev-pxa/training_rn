import { LoginResponse } from '../types/login';

// 简单的内存存储（实际项目可使用 AsyncStorage）
const storage = {
  token: null as string | null,
  user: null as LoginResponse['user'] | null,
};

// 保存登录信息
export function saveAuthData(data: LoginResponse): void {
  storage.token = data.token;
  storage.user = data.user;
}

// 获取 token
export function getToken(): string | null {
  return storage.token;
}

// 获取用户信息
export function getUser(): LoginResponse['user'] | null {
  return storage.user;
}

// 清除登录信息
export function clearAuthData(): void {
  storage.token = null;
  storage.user = null;
}

// 检查是否已登录
export function isLoggedIn(): boolean {
  return storage.token !== null && storage.user !== null;
}
