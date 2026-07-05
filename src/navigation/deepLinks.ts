import { RootStackParamList } from '../types/navigation';
import { CourseCategory } from '../types/courseList';

/**
 * App 支持的 scheme 和 HTTPS 域名。
 *
 * qixuntong:// 用于 App 内外部唤起；
 * https://app.qixuntong.com 预留给后续 Android App Links / iOS Universal Links。
 */
export const DEEP_LINK_PREFIXES = ['qixuntong://', 'https://app.qixuntong.com'];

type DeepLinkScreen = keyof RootStackParamList;

export type DeepLinkTarget =
  | { screen: 'Login'; params?: RootStackParamList['Login'] }
  | { screen: 'Register'; params?: RootStackParamList['Register'] }
  | { screen: 'Home'; params?: RootStackParamList['Home'] }
  | { screen: 'Profile'; params?: RootStackParamList['Profile'] }
  | { screen: 'CourseList'; params?: RootStackParamList['CourseList'] }
  | { screen: 'CoursePlayer'; params?: RootStackParamList['CoursePlayer'] }
  | { screen: 'Exam'; params: RootStackParamList['Exam'] }
  | { screen: 'ExamResult'; params: RootStackParamList['ExamResult'] }
  | { screen: 'CertificateDetail'; params: RootStackParamList['CertificateDetail'] };

/**
 * 公开页面不需要登录态即可访问。
 *
 * 其他页面都属于业务栈，需要登录后才能进入。
 */
const PUBLIC_SCREENS: DeepLinkScreen[] = ['Login', 'Register'];

function isPublicScreen(screen: DeepLinkScreen): boolean {
  return PUBLIC_SCREENS.includes(screen);
}

/**
 * 判断 deep link 目标是否需要鉴权。
 *
 * 导航层用它决定：未登录打开业务链接时，是直接导航，还是先缓存起来等登录完成。
 */
export function isProtectedDeepLinkTarget(target: DeepLinkTarget): boolean {
  return !isPublicScreen(target.screen);
}

/**
 * 从 URL 中提取业务路径。
 *
 * qixuntong://course/player?courseId=1 这种自定义 scheme 的 host 是 course，pathname 是 /player；
 * https://app.qixuntong.com/course/player 的 pathname 是 /course/player。
 * 为了让两种写法共用同一套路由表，这里把 host/pathname 规整成统一的 course/player。
 */
function getDeepLinkPath(url: URL): string {
  if (url.protocol === 'qixuntong:') {
    return [url.hostname, url.pathname].join('/').replace(/^\/+|\/+$/g, '');
  }

  return url.pathname.replace(/^\/+|\/+$/g, '');
}

function getOptionalParam(searchParams: URLSearchParams, key: string): string | undefined {
  const value = searchParams.get(key);
  return value ?? undefined;
}

function getRequiredParam(searchParams: URLSearchParams, key: string): string {
  const value = searchParams.get(key);

  if (!value) {
    throw new Error(`Deep link 缺少必填参数：${key}`);
  }

  return value;
}

function getRequiredNumberParam(searchParams: URLSearchParams, key: string): number {
  const value = Number(getRequiredParam(searchParams, key));

  if (Number.isNaN(value)) {
    throw new Error(`Deep link 参数不是合法数字：${key}`);
  }

  return value;
}

function getOptionalNumberParam(searchParams: URLSearchParams, key: string): number | undefined {
  const value = searchParams.get(key);

  if (!value) {
    return undefined;
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    throw new Error(`Deep link 参数不是合法数字：${key}`);
  }

  return numberValue;
}

/**
 * 将外部 URL 解析成 React Navigation 的页面和参数。
 *
 * 所有路径集中在这里注册，新增页面时只需要补一条 case，避免页面里散落 URL 解析逻辑。
 */
export function parseDeepLink(url: string): DeepLinkTarget | null {
  const parsedUrl = new URL(url);
  const path = getDeepLinkPath(parsedUrl);
  const { searchParams } = parsedUrl;

  switch (path) {
    case 'login':
      return { screen: 'Login' };
    case 'register':
      return { screen: 'Register' };
    case 'home':
      return { screen: 'Home' };
    case 'profile':
      return { screen: 'Profile' };
    case 'courses':
      return {
        screen: 'CourseList',
        params: {
          category: getOptionalParam(searchParams, 'category') as CourseCategory | undefined,
        },
      };
    case 'course/player':
      return {
        screen: 'CoursePlayer',
        params: {
          courseId: getOptionalParam(searchParams, 'courseId'),
        },
      };
    case 'exam/detail':
      return {
        screen: 'Exam',
        params: {
          courseId: getOptionalParam(searchParams, 'courseId'),
          chapterId: getRequiredNumberParam(searchParams, 'chapterId'),
          name: getOptionalParam(searchParams, 'name'),
        },
      };
    case 'exam/result':
      return {
        screen: 'ExamResult',
        params: {
          examRecordId: getRequiredParam(searchParams, 'examRecordId'),
          courseId: getOptionalParam(searchParams, 'courseId'),
          chapterId: getOptionalNumberParam(searchParams, 'chapterId'),
          name: getOptionalParam(searchParams, 'name'),
        },
      };
    case 'certificate/detail':
      return {
        screen: 'CertificateDetail',
        params: {
          certificateId: getRequiredNumberParam(searchParams, 'certificateId'),
        },
      };
    default:
      return null;
  }
}
