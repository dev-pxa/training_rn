import { Course } from './home';

/** 课程分类：all(全部) / series(系列课程) / micro(微课程) / required(岗位必修) / certificate(专业证书) / safety(安全专题) / skill(技能提升) */
export type CourseCategory = 'all' | 'series' | 'micro' | 'required' | 'certificate' | 'safety' | 'skill';

/** 课程分类项 */
export interface CategoryTab {
  /** 分类key */
  key: CourseCategory;
  /** 分类名称 */
  label: string;
}

/** 课程列表响应 */
export interface CourseListResponse {
  /** 响应状态码 */
  code: number;
  /** 响应消息 */
  desc: string;
  /** 响应数据 */
  data: {
    /** 课程列表 */
    list: Course[];
  };
}
