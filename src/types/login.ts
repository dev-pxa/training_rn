// 企业信息
export interface Company {
  code: string;
  name: string;
}

// 协议内容
export interface Agreement {
  serviceAgreement: {
    title: string;
    content: string;
  };
  privacyPolicy: {
    title: string;
    content: string;
  };
}

// 登录页配置接口响应
export interface LoginConfigResponse {
  companies: Company[];
  agreements: Agreement;
}

// 登录请求参数
export interface LoginRequest {
  companyCode: string;
  username: string;
  password: string;
}

// 登录接口响应
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    name: string;
    avatar?: string;
    companyCode: string;
    companyName: string;
  };
}
