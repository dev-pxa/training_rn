import { HomeResponse } from '../types/home';
import { LoginConfigResponse, LoginRequest, LoginResponse } from '../types/login';
import { ProfileResponse } from '../types/profile';
import { CourseDetailResponse, UpdatePlayProgressRequest, UpdatePlayProgressResponse } from '../types/coursePlayer';
import { ExamResponse, ExamResultResponse, ExamSubmitRequest, ExamSubmitResponse } from '../types/exam';

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

// Mock 个人中心数据
export const mockProfileData: ProfileResponse = {
  code: 0,
  desc: '查询成功',
  data: {
    stats: [
      {
        value: '1260',
        label: '累计学习时长(分钟)',
        type: 'studyMinutes',
      },
      {
        value: '5',
        label: '获得证书',
        type: 'certificate',
      },
      {
        value: '8/156',
        label: '学习排名',
        type: 'ranking',
      },
    ],
    recentLearning: [
      {
        id: '1',
        courseName: '智慧安防：2024传感器安装规范',
        coverImage: 'https://example.com/cover1.jpg',
        lastWatched: '12分钟前',
        progress: 65,
        jumpUrl: '/course/1',
      },
      {
        id: '2',
        courseName: '云端协同方案实操视频',
        coverImage: 'https://example.com/cover2.jpg',
        lastWatched: '2小时前',
        progress: 30,
        jumpUrl: '/course/2',
      },
      {
        id: '3',
        courseName: '工业网关部署规范',
        coverImage: 'https://example.com/cover3.jpg',
        lastWatched: '昨天',
        progress: 100,
        jumpUrl: '/course/3',
      },
    ],
  },
};

// 获取个人中心数据
export async function fetchProfile(): Promise<ProfileResponse> {
  if (!USE_MOCK) {
    throw new Error('Mock is disabled');
  }
  await delay(MOCK_DELAY);
  return mockProfileData;
}

// Mock 课程详情数据
export const mockCourseDetailData: CourseDetailResponse = {
  code: 0,
  desc: '成功',
  data: {
    id: 1,
    title: '2026款传感核心组件安装规范',
    desc: '本节重点：红外传感器的防死角部署与盲点规避。',
    currentChapterIndex: 0,
    chapters: [
      {
        id: 1,
        index: '01',
        name: '基础：传感器工作原理',
        type: 'video',
        spendTime: 1520,
        status: 'playing',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        initialTime: 60,
      },
      {
        id: 2,
        index: '02',
        name: '部署：2026款硬件安装实操',
        type: 'video',
        spendTime: 72000,
        status: 'completed',
        url: 'https://www.w3schools.com/html/movie.mp4',
        initialTime: 72000,
      },
      {
        id: 3,
        index: '03',
        name: '部署：2026款硬件安装实操',
        type: 'video',
        spendTime: 72000,
        status: 'completed',
        url: 'https://www.w3schools.com/html/movie.mp4',
        initialTime: 72000,
      },
      {
        id: 4,
        index: '04',
        name: '进阶：多机联动信号补偿111',
        type: 'video',
        spendTime: 18000,
        status: 'playing',
        url: 'https://www.w3schools.com/html/movie.mp4',
        initialTime: 0,
      },
      {
        id: 5,
        index: '05',
        name: '进阶：多机联动信号补偿2222',
        type: 'video',
        spendTime: 18000,
        status: 'playing',
        url: 'https://www.w3schools.com/html/movie.mp4',
        initialTime: 0,
      },
      {
        id: 6,
        index: '06',
        name: '进阶：多机联动信号补偿3333',
        type: 'video',
        spendTime: 18000,
        status: 'playing',
        url: 'https://www.w3schools.com/html/movie.mp4',
        initialTime: 0,
      },
      {
        id: 7,
        index: '07',
        name: '进阶：多机联动信号补偿4444',
        type: 'video',
        spendTime: 18000,
        status: 'playing',
        url: 'https://www.w3schools.com/html/movie.mp4',
        initialTime: 0,
      },
      {
        id: 8,
        index: '08',
        name: '进阶：多机联动信号补偿5555',
        type: 'video',
        spendTime: 18000,
        status: 'playing',
        url: 'https://www.w3schools.com/html/movie.mp4',
        initialTime: 0,
      },
      {
        id: 9,
        index: '09',
        name: '结业考试',
        type: 'test',
        spendTime: 1800,
        status: 'locked',
        url: '',
        initialTime: 0,
      },
    ],
  },
};

// 获取课程详情
export async function fetchCourseDetail(courseId: string): Promise<CourseDetailResponse> {
  if (!USE_MOCK) {
    throw new Error('Mock is disabled');
  }
  await delay(MOCK_DELAY);
  console.log('fetchCourseDetail courseId:', courseId);
  return mockCourseDetailData;
}

// Mock 更新播放进度响应
export const mockUpdatePlayProgressResponse: UpdatePlayProgressResponse = {
  code: 0,
  desc: '更新成功',
  data: null,
};

// 更新播放进度
export async function updatePlayProgress(request: UpdatePlayProgressRequest): Promise<UpdatePlayProgressResponse> {
  if (!USE_MOCK) {
    throw new Error('Mock is disabled');
  }
  await delay(MOCK_DELAY);
  console.log('updatePlayProgress:', request);
  return mockUpdatePlayProgressResponse;
}

export const mockExamData: ExamResponse = {
  code: 0,
  desc: '成功',
  data: {
    name: '智能家居方案顾问认证考试',
    desc: '用于确认你已掌握全屋智能方案设计、设备安装规范、网关组网与售后处理流程。',
    // 考前确认页展示内容：除顶部导航和底部按钮外，页面文案全部从该对象读取。
    startPage: {
      statusText: '认证考试 · 即将开始',
      // 信息卡 value 也由接口直接返回，避免前端自行拼接“分钟/题”等业务文案。
      summaryItems: [
        {
          type: 'duration',
          label: '考试时间',
          value: '30 分钟',
        },
        {
          type: 'questionCount',
          label: '题目数量',
          value: '6 题',
        },
      ],
      requirementTitle: '考试要求说明',
      requirements: [
        '请确认当前账号为本人使用，考试结果将同步到个人认证记录。',
        '考试开始后不可暂停；倒计时结束时，系统将自动提交已作答内容。',
        '认证考试已开启切屏监测，切屏 2 次将自动交卷。',
        '请保持网络稳定，提交前可在题目列表中检查未完成题目。',
      ],
      notice: '开始前请关闭无关应用通知，确保接下来 30 分钟可以连续完成考试。',
      confirmText: '点击“去开始”表示你已确认考试信息和相关要求。',
    },
    // 答题页顶部黄色警告条文案，由后端返回，方便不同考试配置不同监考规则。
    warningText: '由于是认证考试，系统已开启切屏监测，切屏2次将自动交卷。',
    status: 'not_started',
    durationSeconds: 1800,
    remainingSeconds: 1800,
    currentQuestionIndex: 0,
    // 题目 mock 贴合当前课程“红外传感核心组件安装规范”，覆盖部署、避障、调试和交付场景。
    questions: [
      {
        id: 1,
        type: 1,
        title: '红外传感核心组件安装前，应先确认现场$、设备$和安装$均符合施工规范。',
        score: 10,
        blankCount: 3,
      },
      {
        id: 2,
        type: 0,
        title: '在狭长走廊部署红外传感器时，以下哪种做法最能减少探测死角？',
        score: 5,
        options: [
          '将传感器安装在门后，避免影响墙面美观。',
          '沿人员主要动线布点，并让探测扇区覆盖转角和入口区域。',
          '只在走廊尽头安装一个传感器，减少设备数量。',
          '把灵敏度调到最低，避免误触发。',
        ],
      },
      {
        id: 3,
        type: 0,
        title: '红外传感器靠近空调出风口或强热源安装，最可能带来什么问题？',
        score: 5,
        options: [
          '设备外壳颜色会发生明显变化。',
          '探测区域会自动扩大到两倍。',
          '温度扰动可能造成误报或触发不稳定。',
          '设备会无法接收任何网关信号。',
        ],
      },
      {
        id: 4,
        type: 1,
        title: '完成安装后，联动调试应依次核对$、平台$和告警$。',
        score: 10,
        blankCount: 3,
      },
      {
        id: 5,
        type: 0,
        title: '发现红外传感器覆盖范围内存在柜体遮挡时，最合适的处理方式是？',
        score: 5,
        options: [
          '保持原位置不变，在验收单中备注即可。',
          '提高网关发射功率，遮挡问题会自动消失。',
          '调整安装位置或角度，并重新进行动线触发测试。',
          '关闭该传感器的告警联动，避免后续误报。',
        ],
      },
      {
        id: 6,
        type: 1,
        title: '交付前应保存安装$、测试$和客户$，作为后续运维追溯依据。',
        score: 10,
        blankCount: 3,
      },
    ],
  },
};

export async function mockSubmitExam(request: ExamSubmitRequest): Promise<ExamSubmitResponse> {
  await delay(MOCK_DELAY);

  const answeredCount = request.answers.filter(answer => {
    if (answer.type === 0) {
      return answer.optionIndex >= 0;
    }

    return answer.values.length > 0 && answer.values.every(value => value.trim().length > 0);
  }).length;
  const isPassedRecord = answeredCount >= Math.ceil(mockExamData.data.questions.length * 0.8);

  return {
    code: 0,
    desc: '提交成功',
    data: {
      examRecordId: isPassedRecord ? `exam_record_pass_${Date.now()}` : `exam_record_fail_${Date.now()}`,
    },
  };
}

const mockPassedExamResult: ExamResultResponse = {
  code: 0,
  desc: '查询成功',
  data: {
    examRecordId: 1,
    examName: '智能家居方案顾问认证考试',
    passed: true,
    score: 86,
    passScore: 70,
    resultStatusText: '已通过认证',
    resultDesc: '成绩已同步到你的个人认证记录。本次已达到方案顾问认证标准，可在客户项目中展示认证标识。',
    dataOverview: [
      {
        name: '答对题目数',
        value: '17/20',
      },
      {
        name: '作答时长',
        value: '26:18',
      },
      {
        name: '正确率',
        value: '85%',
      },
    ],
    typePerformance: [
      {
        name: '单选题',
        correctCount: 9,
        totalCount: 10,
      },
      {
        name: '填空题',
        correctCount: 4,
        totalCount: 5,
      },
    ],
    tipInfo: {
      img: '',
      title: '认证记录已更新',
      desc: '你可以在个人中心查看证书和认证记录。',
    }
  },
};

const mockFailedExamResult: ExamResultResponse = {
  code: 0,
  desc: '查询成功',
  data: {
    examRecordId: 2,
    examName: '智能家居方案顾问认证考试',
    passed: false,
    score: 58,
    passScore: 70,
    resultStatusText: '未通过认证',
    resultDesc: '本次未达到 70 分通过线，成绩已保存。建议先补齐网关组网、售后工单和多选判断后再重新考试。',
    dataOverview: [
      {
        name: '答对题目数',
        value: '11/20',
      },
      {
        name: '作答时长',
        value: '29:42',
      },
      {
        name: '正确率',
        value: '55%',
      },
    ],
    typePerformance: [
      {
        name: '单选题',
        correctCount: 6,
        totalCount: 10,
      },
      {
        name: '填空题',
        correctCount: 3,
        totalCount: 5,
      },
    ],
    tipInfo: {
      img: '',
      title: '建议完成补强学习',
      desc: '距离 70 分通过线还有提升空间，建议复习课程重点后再考。',
    }
  },
};

export async function mockFetchExamResult(examRecordId: number): Promise<ExamResultResponse> {
  await delay(MOCK_DELAY);

  return true ? mockFailedExamResult : mockPassedExamResult;
}
