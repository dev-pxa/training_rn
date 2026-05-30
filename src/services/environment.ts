// 环境配置文件
// 根据当前环境切换不同的基础域名

// 环境类型
type Environment = 'development' | 'test' | 'production';

// 当前环境
const ENV: Environment = 'development';

// 各环境的基础 API 域名配置
// Android 模拟器访问宿主机器需要使用 10.0.2.2 而不是 127.0.0.1
const API_DOMAINS: Record<Environment, string> = {
  development: 'http://10.0.2.2:4523/m1/8000488-7754565-default',
  test: 'http://test-api.example.com',
  production: 'https://api.example.com',
};

// 当前环境的基础 API 域名
export const API_BASE_URL = API_DOMAINS[ENV];

// API 路径前缀
export const API_PATH_PREFIX = '/api/app';

// 完整的 API 基础路径
export const FULL_API_BASE_URL = `${API_BASE_URL}${API_PATH_PREFIX}`;