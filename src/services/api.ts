import { HomeResponse } from '../types/home';
import { LoginApiResponse, LoginConfigResponse, LoginRequest, LoginResponse } from '../types/login';
import { CourseListResponse } from '../types/courseList';
import { ProfileResponse } from '../types/profile';
import { CourseDetailResponse, UpdatePlayProgressRequest, UpdatePlayProgressResponse } from '../types/coursePlayer';
import { CertificateDetailResponse, ExamResponse, ExamResultResponse, ExamSubmitRequest, ExamSubmitResponse } from '../types/exam';
import { USE_MOCK, mockHomeData, mockLoginConfig, mockLogin, mockDelay, mockProfileData, mockCourseDetailData, mockUpdatePlayProgressResponse, mockExamData, mockFetchExamResult, mockSubmitExam, mockFetchCertificateDetail } from './mock';
import { request } from './request';

const USE_EXAM_MOCK = false;

/**
 * 校验后端通用响应。
 *
 * 项目里接口文档有的字段使用 des。
 * 这里统一兼容两种写法，避免每个 API 函数重复处理字段差异。
 */
function ensureApiSuccess<T extends { code: number; des?: string }>(
  result: T,
  fallbackMessage: string,
): T {
  if (result.code !== 0) {
    throw new Error(result.des || fallbackMessage);
  }

  return result;
}

/**
 * 将登录接口响应归一化成 AuthContext 需要的 { token, user }。
 *
 * 现在项目文档里登录响应示例是裸数据：{ token, user }；
 * 但真实 mock/接口平台经常会统一包一层：{ code, des, data: { token, user } }。
 * 如果不在这里归一化，LoginScreen 拿到包装对象后再传给 signIn，就会出现 token/user 为 undefined。
 */
function normalizeLoginResponse(result: LoginResponse | LoginApiResponse): LoginResponse {
  const maybeWrappedResult = result as Partial<LoginApiResponse>;
  const loginData = maybeWrappedResult.data ?? (result as LoginResponse);

  if (maybeWrappedResult.code !== 0) {
    throw new Error(maybeWrappedResult.des || '登录失败');
  }

  if (!loginData?.token || !loginData?.user) {
    throw new Error('登录接口返回数据缺少 token 或用户信息');
  }

  return loginData;
}

/**
 * 生成查询字符串。
 *
 * React Native 运行环境里直接用 URL 处理相对路径不如浏览器稳定，
 * 所以这里用 encodeURIComponent 手动拼接，保证 Android/iOS 行为一致。
 */
function buildQuery(params: Record<string, string | number | undefined>): string {
  const queryString = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return queryString ? `?${queryString}` : '';
}

// 获取首页数据
export async function fetchHomeData(): Promise<HomeResponse> {
  if (USE_MOCK) {
    return mockDelay(mockHomeData);
  }

  // 首页属于登录后业务数据，默认走 request 的鉴权逻辑并自动携带 Authorization。
  return request<HomeResponse>('/home');
}

// 获取登录页配置
export async function fetchLoginConfig(): Promise<LoginConfigResponse> {
  if (USE_MOCK) {
    return mockDelay(mockLoginConfig);
  }

  // 登录页配置是公开接口，必须显式 auth: false，避免未登录时错误携带空 token。
  const result = await request<LoginConfigResponse>('/login/config', {}, { auth: false });
  
  return ensureApiSuccess(result, '获取登录配置失败');
}

// 登录接口
export async function login(loginRequest: LoginRequest): Promise<LoginResponse> {
  if (USE_MOCK) {
    return mockDelay(mockLogin(loginRequest));
  }

  // 登录接口本身不需要鉴权；这里先兼容包装/非包装响应，再交给 AuthContext 持久化。
  const result = await request<LoginResponse | LoginApiResponse>('/login', {
    method: 'POST',
    body: JSON.stringify(loginRequest),
  }, { auth: false });

  return normalizeLoginResponse(result);
}

// 获取课程列表
export async function fetchCourseList(type?: string): Promise<CourseListResponse> {
  if (USE_MOCK) {
    // TODO: 添加 mock 数据
    throw new Error('Mock not implemented');
  }

  const query = type && type !== 'all' ? buildQuery({ type }) : '';
  const result = await request<CourseListResponse>(`/courses${query}`);

  return ensureApiSuccess(result, '获取课程列表失败');
}

// 获取个人中心数据
export async function fetchProfile(): Promise<ProfileResponse> {
  if (USE_MOCK) {
    return mockDelay(mockProfileData);
  }

  const result = await request<ProfileResponse>('/profile');

  return ensureApiSuccess(result, '获取个人中心数据失败');
}

// 获取课程详情
export async function fetchCourseDetail(courseId: string): Promise<CourseDetailResponse> {
  if (USE_MOCK) {
    return mockDelay(mockCourseDetailData);
  }

  const result = await request<CourseDetailResponse>(`/course${buildQuery({ id: courseId })}`);

  return ensureApiSuccess(result, '获取课程详情失败');
}

// 更新播放进度
export async function updatePlayProgress(playProgressRequest: UpdatePlayProgressRequest): Promise<UpdatePlayProgressResponse> {
  if (USE_MOCK) {
    return mockDelay(mockUpdatePlayProgressResponse);
  }

  const result = await request<UpdatePlayProgressResponse>('/course/play-progress', {
    method: 'POST',
    body: JSON.stringify(playProgressRequest),
  });

  return ensureApiSuccess(result, '更新播放进度失败');
}

// 获取考试详情
export async function fetchExamDetail(courseId: string, chapterId: number): Promise<ExamResponse> {
  if (USE_EXAM_MOCK) {
    // 不使用 mockDelay：mockDelay 会在 USE_MOCK=false 时抛错，导致考试页进入错误态。
    return mockExamData;
  }

  const result = await request<ExamResponse>(`/exam${buildQuery({ courseId, chapterId })}`);

  return ensureApiSuccess(result, '获取考试信息失败');
}

// 提交考试
export async function submitExam(examSubmitRequest: ExamSubmitRequest): Promise<ExamSubmitResponse> {
  if (USE_EXAM_MOCK) {
    return mockSubmitExam(examSubmitRequest);
  }

  const result = await request<ExamSubmitResponse>('/examSubmit', {
    method: 'POST',
    body: JSON.stringify(examSubmitRequest),
  });

  return ensureApiSuccess(result, '提交考试失败');
}

// 获取考试结果
export async function fetchExamResult(examRecordId: number): Promise<ExamResultResponse> {
  if (USE_EXAM_MOCK) {
    return mockFetchExamResult(examRecordId);
  }

  const result = await request<ExamResultResponse>(`/examResult${buildQuery({ examRecordId })}`);

  return ensureApiSuccess(result, '获取考试结果失败');
}

// 获取证书详情
export async function fetchCertificateDetail(certificateId: number): Promise<CertificateDetailResponse> {
  if (USE_EXAM_MOCK) {
    return mockFetchCertificateDetail(certificateId);
  }

  const result = await request<CertificateDetailResponse>(`/certificateDetail${buildQuery({ certificateId })}`);

  return ensureApiSuccess(result, '获取证书详情失败');
}
