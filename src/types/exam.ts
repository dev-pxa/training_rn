export type ExamStatus = 'not_started' | 'in_progress';

/** 后端题型约定：0 为单选题，1 为填空题。 */
export type ExamQuestionType = 0 | 1;

interface BaseExamQuestion {
  /** 题目唯一 ID，用于保存本地答案 map。 */
  id: number;
  /** 题型：0 单选，1 填空。 */
  type: ExamQuestionType;
  /** 题干；填空题使用 $ 作为空位占位符。 */
  title: string;
  /** 当前题分值，直接展示在答题页题型标签旁边。 */
  score: number;
}

export interface ChoiceExamQuestion extends BaseExamQuestion {
  type: 0;
  /** 单选题选项文案，页面按数组下标映射 A/B/C/D。 */
  options: string[];
}

export interface FillExamQuestion extends BaseExamQuestion {
  type: 1;
  /** 填空数量，页面根据该值渲染输入框数量。 */
  blankCount: number;
}

export type ExamQuestion = ChoiceExamQuestion | FillExamQuestion;

export interface ExamStartSummaryItem {
  /** 信息卡类型只影响图标选择，label/value 均由接口控制。 */
  type: 'duration' | 'questionCount';
  /** 信息卡标题，例如“考试时间”。 */
  label: string;
  /** 信息卡内容，例如“30 分钟”。 */
  value: string;
}

export interface ExamStartPageInfo {
  /** hero 左上角状态文案，例如“认证考试 · 即将开始”。 */
  statusText: string;
  /** 考前确认页双信息卡数据。 */
  summaryItems: ExamStartSummaryItem[];
  /** 要求说明模块标题。 */
  requirementTitle: string;
  /** 要求说明列表，页面按顺序自动编号。 */
  requirements: string[];
  /** 黄色提醒卡文案。 */
  notice: string;
  /** 底部确认提示文案，按钮本身仍由前端固定。 */
  confirmText: string;
}

export interface ExamDetail {
  /** 考试名称，展示在考前确认页 hero。 */
  name: string;
  /** 考试说明，展示在考前确认页 hero。 */
  desc: string;
  /** 考前确认页除顶部导航和底部按钮外的全部展示文案。 */
  startPage: ExamStartPageInfo;
  /** 答题页顶部黄色警告条文案，由接口控制。 */
  warningText: string;
  /** 考试状态：未开始显示确认页，进行中直接进入答题页。 */
  status: ExamStatus;
  /** 考试总时长秒数，用于点击“去开始”后初始化倒计时。 */
  durationSeconds: number;
  /** 题目总数，用于答题页进度展示。 */
  questionCount: number;
  /** 剩余秒数，用于后端返回进行中考试时继续倒计时。 */
  remainingSeconds: number;
  /** 后端返回进行中考试时要恢复到的题目下标。 */
  currentQuestionIndex: number;
  /** 页面一次接口拿到的全部题目。 */
  questions: ExamQuestion[];
}

export interface ExamResponse {
  /** 业务状态码，0 表示成功。 */
  code: number;
  /** 后端成功/失败描述，兼容 desc/des 两种字段命名。 */
  desc?: string;
  des?: string;
  /** 考试详情数据。 */
  data: ExamDetail;
}
