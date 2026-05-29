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
import { fetchHomeData } from '../../services/api';
import { HomeResponse, CourseModule } from '../../types/home';
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

/** 轮播图数据 */
const BANNER_DATA = {
  interval: 3,
  items: [
    {
      id: 'banner_001',
      imageUrl: 'https://modao.cc/agent-py/media/generated_images/2026-03-08/03d7492f51664383a7f9fe8bb5904a46.jpg',
      jumpUrl: 'https://example.com/banner1',
    },
    {
      id: 'banner_002',
      imageUrl: 'https://modao.cc/agent-py/media/generated_images/2026-03-08/097af12357444a9b84fb1d8a89b1b65d.jpg',
      jumpUrl: 'https://example.com/banner2',
    },
    {
      id: 'banner_003',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
      jumpUrl: 'https://example.com/banner3',
    },
  ],
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { data: homeData, loading, error, fetchData } = useFetchData<HomeResponse['data']>();

  /** 组件挂载时加载首页数据 */
  useEffect(() => {
    fetchData(fetchHomeData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 点击课程卡片处理 */
  const handleCoursePress = (jumpUrl: string) => {
    console.log('跳转课程:', jumpUrl);
  };

  /** 点击模块链接处理 */
  const handleModuleLinkPress = (link: string) => {
    console.log('跳转模块:', link);
  };

  /** 点击轮播图处理 */
  const handleBannerPress = (jumpUrl: string) => {
    console.log('跳转Banner:', jumpUrl);
  };

  /** 点击 Tab 处理 */
  const handleTabPress = (tabKey: string) => {
    console.log('切换 Tab:', tabKey);
    if (tabKey === 'profile') {
      navigation.navigate('Profile');
    }
  };

  /** 渲染课程模块 */
  const renderCourseModule = (module: CourseModule) => (
    <View key={module.moduleType} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{module.sectionTitle}</Text>
        <TouchableOpacity onPress={() => handleModuleLinkPress(module.sectionLink)}>
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
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || '数据加载失败'}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchData(fetchHomeData)}
          >
            <Text style={styles.retryButtonText}>重试</Text>
          </TouchableOpacity>
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