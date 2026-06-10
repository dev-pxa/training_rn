import { IconName } from '../../components/Icons/Icon';
import { ExamQuestion, ExamStartSummaryItem } from '../../types/exam';

/** 选择题选项序号展示文本；页面目前最多展示 6 个选项，足够覆盖 mock 和常规单选题。 */
export const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/** 将接口返回的剩余秒数格式化为原型中的 mm:ss 倒计时胶囊文本。 */
export const formatClock = (seconds: number): string => {
  const safeSeconds = Math.max(seconds, 0);
  const minutes = Math.floor(safeSeconds / 60);
  const remainSeconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainSeconds).padStart(2, '0')}`;
};

/** 题目 type 使用后端约定：0 为单选题，1 为填空题；这里集中转换为 UI 标签。 */
export const getQuestionTypeName = (question: ExamQuestion): string => {
  return question.type === 0 ? '单选题' : '填空题';
};

/** 考前确认页信息卡的图标选择规则，文案仍完全由接口返回。 */
export const getSummaryIconName = (item: ExamStartSummaryItem): IconName => {
  return item.type === 'duration' ? 'Clock' : 'Exam';
};
