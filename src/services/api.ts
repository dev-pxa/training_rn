import { HomeResponse } from '../types/home';
import { LoginConfigResponse, LoginRequest, LoginResponse } from '../types/login';
import { CourseListResponse } from '../types/courseList';
import { ProfileResponse } from '../types/profile';
import { CourseDetailResponse, UpdatePlayProgressRequest, UpdatePlayProgressResponse } from '../types/coursePlayer';
import { ExamResponse } from '../types/exam';
import { USE_MOCK, mockHomeData, mockLoginConfig, mockLogin, mockDelay, mockProfileData, mockCourseDetailData, mockUpdatePlayProgressResponse, mockExamData } from './mock';
import { API_BASE_URL, API_PATH_PREFIX } from './environment';

const USE_EXAM_MOCK = false;

// 获取首页数据
export async function fetchHomeData(): Promise<HomeResponse> {
  if (USE_MOCK) {
    return mockDelay(mockHomeData);
  }

  const response = await fetch(`${API_BASE_URL}${API_PATH_PREFIX}/home`, {
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

  const response = await fetch(`${API_BASE_URL}${API_PATH_PREFIX}/login/config`);
  if (!response.ok) {
    throw new Error('获取登录配置失败');
  }
  
  const result = await response.json();
  
  // 接口返回格式为 {code, des, data}
  if (result.code !== 0) {
    throw new Error(result.des || '获取登录配置失败');
  }
  
  return result;
}

// 登录接口
export async function login(request: LoginRequest): Promise<LoginResponse> {
  if (USE_MOCK) {
    return mockDelay(mockLogin(request));
  }

  const response = await fetch(`${API_BASE_URL}${API_PATH_PREFIX}/login`, {
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

// 获取课程列表
export async function fetchCourseList(type?: string): Promise<CourseListResponse> {
  if (USE_MOCK) {
    // TODO: 添加 mock 数据
    throw new Error('Mock not implemented');
  }

  const url = new URL(`${API_BASE_URL}${API_PATH_PREFIX}/courses`);
  if (type && type !== 'all') {
    url.searchParams.append('type', type);
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('获取课程列表失败');
  }

  const result = await response.json();

  // 接口返回格式为 {code, desc, data}
  if (result.code !== 0) {
    throw new Error(result.des || '获取课程列表失败');
  }

  return result;
}

// 获取个人中心数据
export async function fetchProfile(): Promise<ProfileResponse> {
  if (USE_MOCK) {
    return mockDelay(mockProfileData);
  }

  const response = await fetch(`${API_BASE_URL}${API_PATH_PREFIX}/profile`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('获取个人中心数据失败');
  }

  const result = await response.json();

  // 接口返回格式为 {code, desc, data}
  if (result.code !== 0) {
    throw new Error(result.des || '获取个人中心数据失败');
  }

  return result;
}

// 获取课程详情
export async function fetchCourseDetail(courseId: string): Promise<CourseDetailResponse> {
  if (USE_MOCK) {
    return mockDelay(mockCourseDetailData);
  }

  const response = await fetch(`${API_BASE_URL}${API_PATH_PREFIX}/course?id=${courseId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('获取课程详情失败');
  }

  const result = await response.json();

  // 接口返回格式为 {code, desc, data}
  if (result.code !== 0) {
    throw new Error(result.desc || '获取课程详情失败');
  }

  return result;
}

// 更新播放进度
export async function updatePlayProgress(request: UpdatePlayProgressRequest): Promise<UpdatePlayProgressResponse> {
  if (USE_MOCK) {
    return mockDelay(mockUpdatePlayProgressResponse);
  }

  const response = await fetch(`${API_BASE_URL}${API_PATH_PREFIX}/course/play-progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('更新播放进度失败');
  }

  const result = await response.json();

  // 接口返回格式为 {code, desc, data}
  if (result.code !== 0) {
    throw new Error(result.desc || '更新播放进度失败');
  }

  return result;
}

// 获取考试详情
export async function fetchExamDetail(courseId: string, chapterId: number): Promise<ExamResponse> {
  if (USE_EXAM_MOCK) {
    // 不使用 mockDelay：mockDelay 会在 USE_MOCK=false 时抛错，导致考试页进入错误态。
    return mockExamData;
  }

  const url = new URL(`${API_BASE_URL}${API_PATH_PREFIX}/exam`);
  url.searchParams.append('courseId', courseId);
  url.searchParams.append('chapterId', String(chapterId));

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('获取考试信息失败');
  }

  const result = await response.json();

  if (result.code !== 0) {
    throw new Error(result.desc || result.des || '获取考试信息失败');
  }

  return result;
}
