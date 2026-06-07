/** 章节类型 */
export type ChapterType = 'video' | 'test';

/** 章节状态 */
export type ChapterStatus = 'playing' | 'completed' | 'locked';

/** 章节信息 */
export interface Chapter {
  /** 章节ID */
  id: number;
  /** 章节序号 */
  index: string;
  /** 章节名称 */
  name: string;
  /** 章节类型 */
  type: ChapterType;
  /** 已学习时长（秒） */
  spendTime: number;
  /** 章节状态 */
  status: ChapterStatus;
  /** 视频/测试URL */
  url: string;
  /** 初始播放时间（秒） */
  initialTime: number;
}

/** 课程详情数据 */
export interface CourseDetail {
  /** 课程ID */
  id: number;
  /** 课程标题 */
  title: string;
  /** 课程描述/亮点 */
  desc: string;
  /** 上一次播放的章节 */
  currentChapterIndex: number;
  /** 章节列表 */
  chapters: Chapter[];
}

/** 课程详情响应 */
export interface CourseDetailResponse {
  /** 响应状态码 */
  code: number;
  /** 响应描述 */
  desc: string;
  /** 响应数据 */
  data: CourseDetail;
}

/** 更新播放进度请求 */
export interface UpdatePlayProgressRequest {
  /** 课程ID */
  courseId: string;
  /** 章节ID */
  chapterId: number;
  /** 播放位置（秒） */
  playPosition?: number;
}

/** 更新播放进度响应 */
export interface UpdatePlayProgressResponse {
  /** 响应状态码 */
  code: number;
  /** 响应描述 */
  desc: string;
  /** 响应数据 */
  data: null;
}
