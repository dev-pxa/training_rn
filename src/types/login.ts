/** 企业信息 */
export interface Company {
  /** 企业代码 */
  code: string;
  /** 企业名称 */
  name: string;
}

/** 协议内容项 */
export interface AgreementContentItem {
  /** 小标题 */
  title: string;
  /** 内容（支持 \n 换行符） */
  content: string;
}

/** 协议信息 */
export interface Agreement {
  /** 服务协议 */
  serviceAgreement: {
    /** 协议标题 */
    title: string;
    /** 协议内容列表 */
    contents: AgreementContentItem[];
  };
  /** 隐私政策 */
  privacyPolicy: {
    /** 协议标题 */
    title: string;
    /** 协议内容列表 */
    contents: AgreementContentItem[];
  };
}

/** API 通用响应包装 */
export interface ApiResponse<T> {
  /** 状态码，0 表示成功 */
  code: number;
  /** 描述信息 */
  des: string;
  /** 数据 */
  data: T;
}

/** 登录页配置数据 */
export interface LoginConfigData {
  /** 企业列表 */
  companies: Company[];
  /** 协议信息 */
  agreements: Agreement;
}

/** 登录页配置接口响应 */
export interface LoginConfigResponse extends ApiResponse<LoginConfigData> {}

/** 登录请求参数 */
export interface LoginRequest {
  /** 企业代码 */
  companyCode: string;
  /** 用户名（工号/手机号） */
  username: string;
  /** 密码 */
  password: string;
}

/** 登录接口响应 */
export interface LoginResponse {
  /** 访问令牌 */
  token: string;
  /** 用户信息 */
  user: {
    /** 用户ID */
    id: string;
    /** 用户名 */
    username: string;
    /** 姓名 */
    name: string;
    /** 头像 */
    avatar?: string;
    /** 企业代码 */
    companyCode: string;
    /** 企业名称 */
    companyName: string;
  };
}