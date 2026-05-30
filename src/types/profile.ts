/** 统计指标类型 */
export type StatsType = 'studyMinutes' | 'certificate' | 'ranking' | 'other';

/** 数据看板统计项 */
export interface StatsItem {
  /** 统计数值（字符串类型，直接展示） */
  value: string;
  /** 文案标签 */
  label: string;
  /** 图标类型标识 */
  type: StatsType;
}

/** 最近学习记录项 */
export interface RecentLearningItem {
  /** 记录ID */
  id: string;
  /** 课程名称 */
  courseName: string;
  /** 封面图片URL */
  coverImage: string;
  /** 上次学习时间 */
  lastWatched: string;
  /** 学习进度百分比 (0-100) */
  progress: number;
  /** 跳转链接 */
  jumpUrl: string;
}

/** 个人中心响应 */
export interface ProfileResponse {
  /** 响应状态码 */
  code: number;
  /** 响应消息 */
  desc: string;
  /** 响应数据 */
  data: {
    /** 数据看板 */
    stats: StatsItem[];
    /** 最近学习记录 */
    recentLearning: RecentLearningItem[];
  };
}