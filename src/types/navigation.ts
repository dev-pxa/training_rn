import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CourseCategory } from './courseList';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Profile: undefined;
  /** 开发者调试页没有路由参数，页面启动后会自行从本地恢复当前接口环境。 */
  DeveloperDebug: undefined;
  CourseList: { category?: CourseCategory } | undefined;
  CoursePlayer: { courseId?: string } | undefined;
  Exam: { courseId?: string; chapterId: number; name?: string } | undefined;
  ExamResult: { examRecordId: string; courseId?: string; chapterId?: number; name?: string };
  CertificateDetail: { certificateId: number };
};

export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
export type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;
export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;
export type DeveloperDebugScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DeveloperDebug'>;
export type CourseListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CourseList'>;
export type CoursePlayerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CoursePlayer'>;
export type ExamScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Exam'>;
export type ExamResultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ExamResult'>;
export type CertificateDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CertificateDetail'>;
