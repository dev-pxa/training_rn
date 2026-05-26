import { HomeResponse } from '../types/home';
import { LoginConfigResponse, LoginRequest, LoginResponse } from '../types/login';

// Mock 开关 - 设置为 false 可移除 mock
export const USE_MOCK = true;

// Mock 延迟（毫秒）
const MOCK_DELAY = 500;

// Mock 首页数据
export const mockHomeData: HomeResponse = {
  code: 200,
  message: 'success',
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
        sectionTitle: '岗位必修 (安装岗)',
        sectionLink: '/learning/required',
        courses: [
          {
            id: 'course_002',
            title: '工业级网关部署规范',
            coverImage: 'https://modao.cc/agent-py/media/generated_images/2026-03-08/097af12357444a9b84fb1d8a89b1b65d.jpg',
            duration: '45分钟',
            label: '热门',
            labelStyle: {
              backgroundColor: '#4F46E5',
              textColor: '#FFFFFF',
            },
            jumpUrl: '/learning/detail/course_002',
          },
          {
            id: 'course_003',
            title: '云端协同方案实操视频',
            coverImage: 'https://modao.cc/agent-py/media/generated_images/2026-03-08/097af12357444a9b84fb1d8a89b1b65d.jpg',
            duration: '32分钟',
            label: '新上线',
            labelStyle: {
              backgroundColor: '#059669',
              textColor: '#FFFFFF',
            },
            jumpUrl: '/learning/detail/course_003',
          },
        ],
      },
      {
        moduleType: 'certificate',
        sectionTitle: '专业证书',
        sectionLink: '/learning/certificate',
        courses: [
          {
            id: 'course_004',
            title: '工业级网关部署规范',
            coverImage: 'https://modao.cc/agent-py/media/generated_images/2026-03-08/097af12357444a9b84fb1d8a89b1b65d.jpg',
            duration: '45分钟',
            label: '热门',
            labelStyle: {
              backgroundColor: '#4F46E5',
              textColor: '#FFFFFF',
            },
            jumpUrl: '/learning/detail/course_004',
          },
          {
            id: 'course_005',
            title: '云端协同方案实操视频',
            coverImage: 'https://modao.cc/agent-py/media/generated_images/2026-03-08/097af12357444a9b84fb1d8a89b1b65d.jpg',
            duration: '32分钟',
            label: '新上线',
            labelStyle: {
              backgroundColor: '#059669',
              textColor: '#FFFFFF',
            },
            jumpUrl: '/learning/detail/course_005',
          },
        ],
      },
    ],
  },
};

// Mock 登录页配置
export const mockLoginConfig: LoginConfigResponse = {
  companies: [
    { code: 'SMART-HOME-01', name: '智家科技总部' },
    { code: 'SMART-HOME-02', name: '智家科技华南分公司' },
    { code: 'SMART-HOME-03', name: '智家科技华北分公司' },
    { code: 'SMART-HOME-04', name: '智家科技华东分公司' },
  ],
  agreements: {
    serviceAgreement: {
      title: '服务协议',
      content: `
服务协议

欢迎使用智家学院企业培训平台服务！

一、服务说明
1. 智家学院是为企业员工提供在线培训学习的平台
2. 本服务仅向企业授权用户开放
3. 用户需通过企业验证代码和工号/手机号登录

二、用户责任
1. 用户应妥善保管自己的账号和密码
2. 不得将账号转借他人使用
3. 遵守平台使用规范，不得发布违规内容

三、知识产权
1. 平台所有课程内容均受知识产权保护
2. 未经授权不得复制、传播课程内容

四、免责声明
1. 因网络故障等不可抗力导致的服务中断，我们不承担责任
2. 用户因违反本协议造成的损失自行承担

五、协议修改
我们有权根据需要修改本协议，修改后的协议一经公布即生效。

      `.trim(),
    },
    privacyPolicy: {
      title: '隐私条款',
      content: `
隐私条款

我们非常重视您的隐私保护。

一、信息收集
1. 我们收集您的工号、姓名等基本信息用于身份验证
2. 收集学习进度数据用于优化学习体验
3. 不会收集与服务无关的个人信息

二、信息使用
1. 仅用于提供培训服务和改善用户体验
2. 不会向第三方出售或出租您的个人信息
3. 经您同意或法律法规要求的情况除外

三、信息安全
1. 我们采用行业标准的安全技术保护您的信息
2. 定期进行安全审计和风险评估

四、您的权利
1. 您可以查询、更正您的个人信息
2. 您可以申请注销账号

五、联系我们
如有隐私相关问题，请联系我们的隐私专员。
      `.trim(),
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
      companyName: mockLoginConfig.companies.find(c => c.code === request.companyCode)?.name || request.companyCode,
    },
  };
}

// 模拟网络延迟
export function mockDelay<T>(data: T): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), MOCK_DELAY);
  });
}