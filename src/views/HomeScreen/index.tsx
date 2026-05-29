import React, { useState, useEffect } from 'react';
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
import { fetchHomeData } from '../../services/api';
import { HomeResponse, CourseModule } from '../../types/home';
import { RootStackParamList } from '../../types/navigation';
import { Icon } from '../../components/Icons';
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
    if (tabKey === 'profile') {
      navigation.navigate('Profile');
    }
  };

  /** 渲染用户头像 */
  const renderAvatar = () => (
    <LinearGradient
      colors={['#4F8EF7', '#7C6EFC']}
      style={styles.avatar}
    >
      <Text style={styles.avatarText}>张</Text>
    </LinearGradient>
  );

  /** 渲染Hero Card继续学习模块 */
  const renderHeroCard = () => {
    if (!homeData?.continueLearning?.course) {
      return null;
    }

    const { course } = homeData.continueLearning;

    return (
      <TouchableOpacity
        style={styles.heroCard}
        activeOpacity={0.8}
        onPress={() => handleCoursePress(course.jumpUrl)}
      >
        <View style={styles.heroContent}>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>继续学习</Text>
            <Text style={styles.heroSubtitle}>上次看到 {course.progress}%</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${course.progress}%` }]} />
            </View>
          </View>
          <LinearGradient
            colors={['#667EEA', '#764BA2']}
            style={styles.heroThumbnail}
          >
            <Text style={styles.heroEmoji}>🎓</Text>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    );
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
          <TouchableOpacity onPress={() => handleModuleLinkPress(sectionLink)}>
            <Text style={styles.sectionLink}>全部历史</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.continueCard}
          activeOpacity={0.8}
          onPress={() => handleCoursePress(course.jumpUrl)}
        >
          <LinearGradient
            colors={['#11998E', '#38EF7D']}
            style={styles.continueThumb}
          >
            <Text style={styles.continueEmoji}>🎓</Text>
          </LinearGradient>
          <View style={styles.continueContent}>
            <View>
              <Text style={styles.continueTitle} numberOfLines={2}>{course.title}</Text>
              <Text style={styles.continueMeta}>上次看到 · 12分钟</Text>
            </View>
            <View style={styles.continueProgress}>
              <View style={styles.miniProgress}>
                <View style={[styles.miniProgressFill, { width: `${course.progress}%` }]} />
              </View>
              <LinearGradient
                colors={['#4F8EF7', '#7C6EFC']}
                style={styles.playBtn}
              >
                <Icon name="Play" size={16} color="#FFFFFF" />
              </LinearGradient>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
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
        {module.courses.map((course, index) => (
          <CourseCard
            key={course.id}
            course={course}
            onPress={handleCoursePress}
            index={index}
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
            onPress={() => {
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
          {renderAvatar()}
        </View>

        {/* Hero Card 继续学习 */}
        {renderHeroCard()}

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

export default HomeScreen;