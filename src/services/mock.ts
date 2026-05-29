import { HomeResponse } from '../types/home';
import { LoginConfigResponse, LoginRequest, LoginResponse } from '../types/login';

// Mock 开关 - 设置为 false 可移除 mock
export const USE_MOCK = false;

// Mock 延迟（毫秒）
const MOCK_DELAY = 500;

// Mock 首页数据
export const mockHomeData: HomeResponse = {
  code: 0,
  desc: '查询成功',
  data: {
    carousel: {
      interval: 3,
      items: [
        {
          id: 'banner_001',
          imageUrl: 'https://modao.cc/agent-py/media/generated_images/2026-03-08/03d7492f51664383a7f9fe8bb5904a46.jpg',
          jumpUrl: 'https://example.com/banner1',
        },
        {
          id: 'banner_002',
          imageUrl: 'https://modao.cc/agent-py/media/generated_images/2026-03-08/097af12357444a9b84fb1d8a89b1b65d.jpg',
          jumpUrl: 'https://example.com/banner2',
        },
        {
          id: 'banner_003',
          imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
          jumpUrl: 'https://example.com/banner3',
        },
      ],
    },
    continueLearning: {
      sectionTitle: '继续学习',
      sectionLink: '/learning/history',
      course: {
        id: 'course_001',
        title: '智慧安防：2026款传感器安装规范',
        coverImage: 'https://modao.cc/agent-py/media/generated_images/2026-03-08/03d7492f51664383a7f9fe8bb5904a46.jpg',
        currentTime: '08:45',
        totalTime: '15:20',
        progress: 50,
        jumpUrl: '/learning/detail/course_001',
      },
    },
    courseModules: [
      {
        moduleType: 'required',
        sectionTitle: '岗位必修（安装岗）',
        sectionLink: '/courses/required',
        courses: [
          {
            id: 'course_001',
            title: '智能家居系统工程师认证',
            coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600',
            type: 'series',
            duration: '12课时',
            label: '热门精选',
            jumpUrl: '/learning/detail/course_001',
          },
          {
            id: 'course_002',
            title: '工业网关部署规范',
            coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
            type: 'series',
            duration: '8课时',
            label: '新课上架',
            jumpUrl: '/learning/detail/course_002',
          },
          {
            id: 'course_003',
            title: '智能照明快速入门',
            coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600',
            type: 'micro',
            duration: '15分钟',
            label: '热门精选',
            jumpUrl: '/learning/detail/course_003',
          },
        ],
      },
      {
        moduleType: 'certificate',
        sectionTitle: '专业证书',
        sectionLink: '/courses/certificate',
        courses: [
          {
            id: 'course_004',
            title: '云端协同方案实操',
            coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600',
            type: 'series',
            duration: '6课时',
            label: '认证课程',
            jumpUrl: '/learning/detail/course_004',
          },
          {
            id: 'course_005',
            title: '安全管理规范',
            coverImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600',
            type: 'micro',
            duration: '20分钟',
            label: '新课上架',
            jumpUrl: '/learning/detail/course_005',
          },
          {
            id: 'course_006',
            title: '智能家居系统集成师',
            coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
            type: 'series',
            duration: '10课时',
            label: '认证课程',
            jumpUrl: '/learning/detail/course_006',
          },
        ],
      },
    ],
  },
};

// Mock 登录页配置
export const mockLoginConfig: LoginConfigResponse = {
  code: 0,
  des: '查询成功',
  data: {
    companies: [
      { code: 'SMART-HOME-01', name: '智家科技总部' },
      { code: 'SMART-HOME-02', name: '智家科技华南分公司' },
      { code: 'SMART-HOME-03', name: '智家科技华北分公司' },
      { code: 'SMART-HOME-04', name: '智家科技华东分公司' },
    ],
    agreements: {
      serviceAgreement: {
        title: '服务协议',
        contents: [
          {
            title: '一、服务条款概述',
            content: '欢迎使用企训通平台。在使用本平台前，请您仔细阅读以下服务条款。使用本平台即表示您已充分理解并同意本协议的全部内容。',
          },
          {
            title: '二、用户账号',
            content: '• 您应妥善保管账号和密码，对账号下的所有行为负责\n• 账号仅限本人使用，不得转借、转让或共享\n• 如发现账号异常使用，请立即通知平台管理员',
          },
          {
            title: '三、学习服务',
            content: '企训通为用户提供智能家居行业相关的培训课程、考试认证等服务。平台将持续更新课程内容，确保教学质量。',
          },
          {
            title: '四、使用规范',
            content: '• 不得利用平台从事任何违法违规活动\n• 不得恶意复制、传播平台课程内容\n• 不得干扰平台的正常运行\n• 尊重知识产权，保护平台内容版权',
          },
          {
            title: '五、免责声明',
            content: '平台将尽力保障服务的稳定性，但不对因不可抗力、网络故障等原因导致的服务中断承担责任。',
          },
        ],
      },
      privacyPolicy: {
        title: '隐私政策',
        contents: [
          {
            title: '一、隐私保护原则',
            content: '我们非常重视您的隐私保护，将按照法律法规要求，采取安全保护措施保护您的个人信息安全。',
          },
          {
            title: '二、信息收集',
            content: '• 账号信息：工号、手机号、姓名等必要的身份信息\n• 学习数据：学习进度、考试成绩、学习时长等\n• 设备信息：用于保障账号安全的设备标识',
          },
          {
            title: '三、信息使用',
            content: '我们收集的信息仅用于提供学习服务、优化用户体验、保障账号安全等目的，不会向无关第三方泄露。',
          },
          {
            title: '四、信息存储',
            content: '您的个人信息将存储在安全的服务器上，我们采用加密技术保护数据安全，并按照法律规定的期限保存。',
          },
          {
            title: '五、您的权利',
            content: '• 查询、更正您的个人信息\n• 删除您的账号及相关数据\n• 撤回同意（可能影响服务使用）\n• 投诉和建议的权利',
          },
        ],
      },
    },
  },
};

// Mock 登录响应
export function mockLogin(request: LoginRequest): LoginResponse {
  return {
    token: 'mock_token_' + Date.now(),
    user: {
      id: 'user_001',
      username: request.username,
      name: request.username === 'admin' ? '管理员' : '学员' + request.username,
      avatar: undefined,
      companyCode: request.companyCode,
      companyName: mockLoginConfig.data.companies.find((c) => c.code === request.companyCode)?.name || request.companyCode,
    },
  };
}

// 模拟网络延迟
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function mockDelay<T>(data: T): Promise<T> {
  if (!USE_MOCK) {
    throw new Error('Mock is disabled');
  }
  await delay(MOCK_DELAY);
  return data;
}

// 获取首页数据
export async function fetchHomeData(): Promise<HomeResponse> {
  if (!USE_MOCK) {
    throw new Error('Mock is disabled');
  }
  await delay(MOCK_DELAY);
  return mockHomeData;
}

// 获取登录页配置
export async function fetchLoginConfig(): Promise<LoginConfigResponse> {
  if (!USE_MOCK) {
    throw new Error('Mock is disabled');
  }
  await delay(MOCK_DELAY);
  return mockLoginConfig;
}

// 登录
export async function login(request: LoginRequest): Promise<LoginResponse> {
  if (!USE_MOCK) {
    throw new Error('Mock is disabled');
  }
  await delay(MOCK_DELAY);
  return mockLogin(request);
}