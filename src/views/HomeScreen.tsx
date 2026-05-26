import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Carousel from '../components/Carousel';
import BottomTabBar, { TabItem } from '../components/BottomTabBar';
import CourseCard from '../components/CourseCard';
import { fetchHomeData } from '../services/api';
import { HomeResponse, CourseModule } from '../types/home';
import { RootStackParamList } from '../types/navigation';
import { Icon } from '../components/Icons';

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

const HomeScreen: React.FC<HomeScreenProps> = () => {
  /** 加载状态 */
  const [loading, setLoading] = useState(true);
  /** 错误信息 */
  const [error, setError] = useState<string | null>(null);
  /** 首页数据 */
  const [homeData, setHomeData] = useState<HomeResponse['data'] | null>(null);

  /** 组件挂载时加载首页数据 */
  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchHomeData();
        if (response.code === 200) {
          setHomeData(response.data);
        } else {
          setError(response.message || '获取数据失败');
        }
      } catch (err) {
        setError('网络请求失败');
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  /** 点击课程卡片处理 */
  const handleCoursePress = (jumpUrl: string) => {
    console.log('跳转课程:', jumpUrl);
  };

  /** 点击模块链接处理 */
  const handleModuleLinkPress = (link: string) => {
    console.log('跳转模块:', link);
  };

  /** 点击 Tab 处理 */
  const handleTabPress = (tabKey: string) => {
    console.log('切换 Tab:', tabKey);
  };

  /** 渲染继续学习模块 */
  const renderContinueLearning = () => {
    if (!homeData?.continueLearning?.course) {
      return null;
    }

    const { sectionTitle, sectionLink, course } = homeData.continueLearning;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{sectionTitle}</Text>
          <View onTouchEnd={() => handleModuleLinkPress(sectionLink)}>
            <Text style={styles.sectionLink}>全部历史</Text>
          </View>
        </View>
        <View
          style={styles.continueCard}
          onTouchEnd={() => handleCoursePress(course.jumpUrl)}
        >
          <View style={styles.thumbnailContainer}>
            <Image
              source={{ uri: course.coverImage }}
              style={styles.thumbnail}
            />
            <View style={styles.playOverlay}>
              <View style={styles.playIcon} />
            </View>
          </View>
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle} numberOfLines={1}>{course.title}</Text>
            <Text style={styles.courseProgress}>
              上次看至：{course.currentTime} / {course.totalTime}
            </Text>
            <View style={styles.courseProgressBar}>
              <View style={[styles.courseProgressFill, { width: `${course.progress}%` }]} />
            </View>
          </View>
        </View>
      </View>
    );
  };

  /** 渲染课程模块 */
  const renderCourseModule = (module: CourseModule) => (
    <View key={module.moduleType} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{module.sectionTitle}</Text>
        <View onTouchEnd={() => handleModuleLinkPress(module.sectionLink)}>
          <Text style={styles.sectionLink}>查看全部</Text>
        </View>
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
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  /** 渲染错误状态 */
  if (error || !homeData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || '数据加载失败'}</Text>
          <View
            style={styles.retryButton}
            onTouchEnd={() => {
              setLoading(true);
              fetchHomeData()
                .then((res) => {
                  if (res.code === 200) {
                    setHomeData(res.data);
                    setError(null);
                  } else {
                    setError(res.message);
                  }
                })
                .catch(() => setError('网络请求失败'))
                .finally(() => setLoading(false));
            }}
          >
            <Text style={styles.retryButtonText}>重试</Text>
          </View>
        </View>
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* 顶部导航 */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>欢迎回来,</Text>
          <View style={styles.userRow}>
            <Text style={styles.userName}>张小智</Text>
          </View>
        </View>
        {/* TODO 通知功能暂时先留着，二期做 */}
        <View style={styles.notificationIcon}>
          <Icon name="Bell" />
          <View style={styles.notificationDot} />
        </View>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 轮播图组件 */}
        <Carousel
          data={homeData.carousel.items}
          interval={homeData.carousel.interval}
        />

        {/* 继续学习模块 */}
        {renderContinueLearning()}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  welcomeText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1F2937',
  },
  notificationIcon: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    backgroundColor: '#EF4444',
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9CA3AF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#2563EB',
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  sectionLink: {
    fontSize: 12,
    color: '#2563EB',
  },
  continueCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumbnailContainer: {
    width: 80,
    height: 56,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  playIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: '#FFFFFF',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  courseInfo: {
    flex: 1,
    overflow: 'hidden',
  },
  courseTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  courseProgress: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  courseProgressBar: {
    marginTop: 8,
    width: '100%',
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 9999,
  },
  courseProgressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 9999,
  },
  courseGrid: {
    flexDirection: 'row',
    gap: 12,
  },
});

export default HomeScreen;