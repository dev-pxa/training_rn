import React, { useEffect, useRef, useState } from 'react';
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
import LinearGradient from 'react-native-linear-gradient';
import BottomTabBar, { TabItem } from '../../components/BottomTabBar';
import CourseCard from '../../components/CourseCard';
import ErrorState from '../../components/ErrorState';
import { RootStackParamList } from '../../types/navigation';
import { Course } from '../../types/home';
import { CourseCategory, CategoryTab, CourseListResponse } from '../../types/courseList';
import { fetchCourseList } from '../../services/api';
import { useFetchData } from '../../hooks/useFetchData';
import { Icon } from '../../components/Icons';
import styles from './styles';

type CourseListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CourseList'>;
type CourseListScreenRouteProp = RouteProp<RootStackParamList, 'CourseList'>;

interface CourseListScreenProps {
  navigation: CourseListScreenNavigationProp;
  route: CourseListScreenRouteProp;
}

/** 底部 Tab 配置 */
const BOTTOM_TABS: TabItem[] = [
  { key: 'home', label: '首页', iconName: 'Home' },
  { key: 'learn', label: '学习', iconName: 'Learn' },
  { key: 'exam', label: '考试', iconName: 'Exam' },
  { key: 'profile', label: '我的', iconName: 'Profile' },
];

/** 分类标签配置 */
const CATEGORY_TABS: CategoryTab[] = [
  { key: 'all', label: '全部' },
  { key: 'series', label: '系列课程' },
  { key: 'micro', label: '微课程' },
  { key: 'required', label: '岗位必修' },
  { key: 'certificate', label: '专业证书' },
  { key: 'safety', label: '安全专题' },
  { key: 'skill', label: '技能提升' },
];

const CourseListScreen: React.FC<CourseListScreenProps> = ({ navigation, route }) => {
  /** 从路由参数获取初始分类 */
  const initialCategory = route.params?.category || 'all';
  const [activeCategory, setActiveCategory] = useState<CourseCategory>(initialCategory);
  const scrollViewRef = useRef<ScrollView>(null);

  /** 获取课程列表数据 */
  const { data, loading, error, fetchData } = useFetchData<{
    list: Course[];
  }>();

  /** 根据分类获取数据 */
  useEffect(() => {
    fetchData(() => fetchCourseList(activeCategory));
  }, [activeCategory, fetchData]);

  /** 点击课程卡片处理 */
  const handleCoursePress = (course: Course) => {
    navigation.navigate('CoursePlayer', { courseId: course.id });
  };

  /** 点击分类标签处理 */
  const handleCategoryPress = (category: CourseCategory) => {
    setActiveCategory(category);
    // 滚动回顶部
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  /** 点击 Tab 处理 */
  const handleTabPress = (tabKey: string) => {
    if (tabKey === 'home') {
      navigation.navigate('Home');
    } else if (tabKey === 'profile') {
      navigation.navigate('Profile');
    }
  };

  /** 渲染分类标签 */
  const renderCategoryTab = (tab: CategoryTab, index: number) => {
    const isActive = tab.key === activeCategory;
    const isLast = index === CATEGORY_TABS.length - 1;
    return (
      <TouchableOpacity
        key={tab.key}
        onPress={() => handleCategoryPress(tab.key)}
        activeOpacity={0.7}
      >
        {isActive ? (
          <LinearGradient
            colors={['#4F8EF7', '#7C6EFC']}
            style={[styles.categoryTab, styles.categoryTabActive, isLast && { marginRight: 0 }]}
          >
            <Text style={[styles.categoryTabText, styles.categoryTabTextActive]}>
              {tab.label}
            </Text>
          </LinearGradient>
        ) : (
          <View style={[styles.categoryTab, isLast && { marginRight: 0 }]}>
            <Text style={styles.categoryTabText}>{tab.label}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  /** 渲染加载状态 */
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F8EF7" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  /** 渲染错误状态 */
  if (error || !data) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <ErrorState
          message={error || '数据加载失败'}
          onRetry={() => fetchData(() => fetchCourseList(activeCategory))}
          onGoHome={() => navigation.navigate('Home')}
        />
      </SafeAreaView>
    );
  }

  const courses = data.list || [];

  /** 渲染空状态 */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Text style={{ fontSize: 40 }}>📚</Text>
      </View>
      <Text style={styles.emptyTitle}>暂无课程</Text>
      <Text style={styles.emptyText}>该分类下暂时没有课程，去其他分类看看吧</Text>
    </View>
  );

  /** 为 Tab 配置添加点击事件 */
  const tabsWithHandlers = BOTTOM_TABS.map((tab) => ({
    ...tab,
    onPress: () => handleTabPress(tab.key),
  }));

  /** 渲染主页面 */
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* 顶部导航 - 固定 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="Back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>课程列表</Text>
        <View style={styles.headerAction} />
      </View>

      {/* 分类标签 - 固定 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryTabs}
      >
        {CATEGORY_TABS.map((tab, index) => renderCategoryTab(tab, index))}
      </ScrollView>

      {/* 筛选栏 - 固定 */}
      <View style={styles.filterBar}>
        <Text style={styles.filterResult}>共 {courses.length} 门课程</Text>
        <TouchableOpacity style={styles.filterSort} activeOpacity={0.7}>
          <Text style={styles.filterSortText}>最新</Text>
          <Icon name="ArrowDown" size={14} color="#4B5563" />
        </TouchableOpacity>
      </View>

      {/* 课程列表 - 可滚动 */}
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={styles.courseScrollView}
      >
        {courses.length > 0 ? (
          <View style={styles.courseGridContainer}>
            <View style={styles.courseGrid}>
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onPress={handleCoursePress}
                />
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.courseGridContainer}>
            {renderEmptyState()}
          </View>
        )}

        {/* 底部安全间距 */}
        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* 底部导航栏 */}
      <BottomTabBar tabs={tabsWithHandlers} activeKey="learn" />
    </SafeAreaView>
  );
};

export default CourseListScreen;
