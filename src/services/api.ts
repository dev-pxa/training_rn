import { HomeResponse } from '../types/home';
import { LoginConfigResponse, LoginRequest, LoginResponse } from '../types/login';
import { USE_MOCK, mockHomeData, mockLoginConfig, mockLogin, mockDelay } from './mock';

// API 基础配置
const API_BASE_URL = 'https://api.example.com/v1';

// 获取首页数据
export async function fetchHomeData(): Promise<HomeResponse> {
  if (USE_MOCK) {
    return mockDelay(mockHomeData);
  }

  const response = await fetch(`${API_BASE_URL}/home`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('获取首页数据失败');
  }
  return response.json();
}

// 获取登录页配置
export async function fetchLoginConfig(): Promise<LoginConfigResponse> {
  if (USE_MOCK) {
    return mockDelay(mockLoginConfig);
  }

  const response = await fetch(`${API_BASE_URL}/login/config`);
  if (!response.ok) {
    throw new Error('获取登录配置失败');
  }
  return response.json();
}

// 登录接口
export async function login(request: LoginRequest): Promise<LoginResponse> {
  if (USE_MOCK) {
    return mockDelay(mockLogin(request));
  }

  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('登录失败');
  }
  return response.json();
}