import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CourseCategory } from './courseList';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Profile: undefined;
  CourseList: { category?: CourseCategory } | undefined;
};

export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
export type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;
export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;
export type CourseListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CourseList'>;
