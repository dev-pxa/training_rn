import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import BottomTabBar, { TabItem } from '../../components/BottomTabBar';
import CourseCard from '../../components/CourseCard';
import Carousel from '../../components/Carousel';
import ErrorState from '../../components/ErrorState';
import { fetchHomeData } from '../../services/api';
import { HomeResponse, CourseModule, Course } from '../../types/home';
import { RootStackParamList } from '../../types/navigation';
import { useFetchData } from '../../hooks/useFetchData';
import styles from './styles';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}

/** 底部 Tab 配置 */
const HOME_TABS: TabItem[] = [
  { key: 'home', label: '首页', iconName: 'Home' },
  { key: 'learn', label: '学习', iconName: 'Learn' },
  { key: 'exam', label: '考试', iconName: 'Exam' },
  { key: 'profile', label: '我的', iconName: 'Profile' },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { data: homeData, loading, error, fetchData } = useFetchData<HomeResponse['data']>();

  /** 组件挂载时加载首页数据 */
  useEffect(() => {
    fetchData(fetchHomeData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 点击课程卡片处理 */
  const handleCoursePress = (course: Course) => {
    navigation.navigate('CoursePlayer', { courseId: course.id });
  };

  /** 点击模块链接处理 */
  const handleModuleLinkPress = (_link: string, moduleType: 'required' | 'certificate') => {
    navigation.navigate('CourseList', { category: moduleType });
  };

  /** 点击轮播图处理 */
  const handleBannerPress = (jumpUrl: string) => {
    console.log('跳转Banner:', jumpUrl);
  };

  /** 点击 Tab 处理 */
  const handleTabPress = (tabKey: string) => {
    if (tabKey === 'home') {
      // 已经在首页了
    } else if (tabKey === 'learn') {
      navigation.navigate('CourseList', { category: 'all' });
    } else if (tabKey === 'profile') {
      navigation.navigate('Profile');
    }
  };

  /** 渲染课程模块 */
  const renderCourseModule = (module: CourseModule) => (
    <View key={module.moduleType} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{module.sectionTitle}</Text>
        <TouchableOpacity onPress={() => handleModuleLinkPress(module.sectionLink, module.moduleType)}>
          <Text style={styles.sectionLink}>查看全部</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.courseGrid}>
        {module.courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onPress={handleCoursePress}
          />
        ))}
      </View>
    </View>
  );

  /** 渲染加载状态 */
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F8EF7" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  /** 渲染错误状态 */
  if (error || !homeData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <ErrorState
          message={error || '数据加载失败'}
          onRetry={() => fetchData(fetchHomeData)}
          onOpenDebug={() => navigation.navigate('DeveloperDebug')}
        />
      </SafeAreaView>
    );
  }

  /** 为 Tab 配置添加点击事件 */
  const tabsWithHandlers = HOME_TABS.map((tab) => ({
    ...tab,
    onPress: () => handleTabPress(tab.key),
  }));

  /** 渲染主页面 */
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 顶部导航 */}
        <View style={styles.header}>
          <View style={styles.greeting}>
            <Text style={styles.greetingSubtitle}>欢迎回来，</Text>
            <Text style={styles.userName}>张小智</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>张</Text>
          </View>
        </View>

        {/* 轮播图 */}
        <Carousel
          interval={homeData.carousel.interval}
          items={homeData.carousel.items}
          onPress={handleBannerPress}
        />

        {/* 课程模块列表 */}
        {homeData.courseModules.map(renderCourseModule)}

        {/* 底部安全间距 */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 底部导航栏 */}
      <BottomTabBar tabs={tabsWithHandlers} activeKey="home" />
    </SafeAreaView>
  );
};

export default HomeScreen;
