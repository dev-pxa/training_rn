/** 课程类型：micro(微课程) / series(系列课程) */
export type CourseType = 'micro' | 'series';

export interface CarouselItem {
  /** 轮播项ID */
  id: string;
  /** 图片URL */
  imageUrl: string;
  /** 跳转URL */
  jumpUrl: string;
}

export interface Carousel {
  /** 轮播间隔时间（秒） */
  interval: number;
  /** 轮播项列表 */
  items: CarouselItem[];
}

export interface ContinueLearningCourse {
  /** 课程ID */
  id: string;
  /** 课程标题 */
  title: string;
  /** 封面图URL */
  coverImage: string;
  /** 当前播放时间 */
  currentTime: string;
  /** 课程总时长 */
  totalTime: string;
  /** 播放进度百分比 (0-100) */
  progress: number;
  /** 跳转链接 */
  jumpUrl: string;
}

export interface ContinueLearning {
  /** 模块标题 */
  sectionTitle: string;
  /** 查看全部链接 */
  sectionLink: string;
  /** 继续学习课程 */
  course: ContinueLearningCourse | null;
}

export interface LabelStyle {
  /** 标签背景色 */
  backgroundColor: string;
  /** 标签文字颜色 */
  textColor: string;
}

export interface Course {
  /** 课程ID */
  id: string;
  /** 课程标题 */
  title: string;
  /** 封面图URL */
  coverImage: string;
  /** 课程类型：micro(微课程) / series(系列课程) */
  type: CourseType;
  /** 课程时长/课时数 */
  duration: string;
  /** 标签文本 */
  label?: string;
  /** 标签样式配置 */
  labelStyle?: LabelStyle;
  /** 跳转链接 */
  jumpUrl: string;
}

export interface CourseModule {
  /** 模块类型：required(岗位必修) / certificate(专业证书) */
  moduleType: 'required' | 'certificate';
  /** 模块标题 */
  sectionTitle: string;
  /** 查看全部链接 */
  sectionLink: string;
  /** 课程列表 */
  courses: Course[];
}

export interface HomeResponse {
  /** 响应状态码 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data: {
    /** 轮播图配置 */
    carousel: Carousel;
    /** 继续学习模块 */
    continueLearning: ContinueLearning | null;
    /** 课程模块列表 */
    courseModules: CourseModule[];
  };
}
