import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import BottomTabBar, { TabItem } from '../../components/BottomTabBar';
import ErrorState from '../../components/ErrorState';
import { RootStackParamList } from '../../types/navigation';
import { Icon } from '../../components/Icons';
import { fetchProfile } from '../../services/api';
import { useFetchData } from '../../hooks/useFetchData';
import { ProfileResponse, RecentLearningItem, StatsItem } from '../../types/profile';
import styles from './styles';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
  route: ProfileScreenRouteProp;
}

/** 底部 Tab 配置 */
const PROFILE_TABS: TabItem[] = [
  { key: 'home', label: '看板', iconName: 'Home' },
  { key: 'learn', label: '学习', iconName: 'Learn' },
  { key: 'exam', label: '考试', iconName: 'Exam' },
  { key: 'profile', label: '我的', iconName: 'Profile' },
];

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  /** 当前激活的 Tab */
  const [activeTab, setActiveTab] = useState('profile');

  /** 获取个人中心数据 */
  const { data: profileData, loading, error, fetchData } = useFetchData<ProfileResponse['data']>();

  /** 组件挂载时加载数据 */
  useEffect(() => {
    fetchData(fetchProfile);
  }, [fetchData]);

  /** Tab 点击处理 */
  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);
    console.log('切换 Tab:', tabKey);
    if (tabKey === 'home') {
      navigation.navigate('Home');
    }
  };

  /** 点击课程处理 */
  const handleCoursePress = (jumpUrl: string) => {
    console.log('跳转课程:', jumpUrl);
  };

  /** 渲染统计项 */
  const renderStatItem = (stat: StatsItem, index: number) => (
    <View key={`stat-${index}`} style={styles.statItem}>
      <Text style={styles.statValue}>{stat.value}</Text>
      <Text style={styles.statLabel}>{stat.label}</Text>
    </View>
  );

  /** 渲染学习记录 */
  const renderLearningRecord = (record: RecentLearningItem) => (
    <TouchableOpacity
      key={record.id}
      style={styles.learningRecordItem}
      activeOpacity={0.7}
      onPress={() => handleCoursePress(record.jumpUrl)}
    >
      <Image source={{ uri: record.coverImage }} style={styles.learningThumbnail} resizeMode="cover" />
      <View style={styles.learningInfo}>
        <Text style={styles.learningCourseName} numberOfLines={1}>
          {record.courseName}
        </Text>
        <Text style={styles.learningTime}>{record.lastWatched}</Text>
      </View>
      <View style={styles.playButton}>
        <Icon name="Play" size={18} color="#4F8EF7" />
      </View>
    </TouchableOpacity>
  );

  /** Tab 配置添加点击事件 */
  const tabsWithHandlers = PROFILE_TABS.map((tab) => ({
    ...tab,
    onPress: () => handleTabPress(tab.key),
  }));

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
  if (error || !profileData) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <ErrorState
          message={error || '数据加载失败'}
          onRetry={() => fetchData(fetchProfile)}
        />
        {/* 底部导航栏 */}
      <BottomTabBar tabs={tabsWithHandlers} activeKey="profile" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 头部信息 */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#4F8EF7', '#7C6EFC']}
                style={styles.avatarGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.avatarText}>张</Text>
              </LinearGradient>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>张小智</Text>
              <Text style={styles.userRole}>安装岗 · 智家科技总部</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>编辑</Text>
          </TouchableOpacity>
        </View>

        {/* 数据看板 */}
        <View style={styles.statsCard}>
          <View style={styles.statsGrid}>
            {profileData.stats.map((stat, index) => renderStatItem(stat, index))}
          </View>
        </View>

        {/* 学习历史 */}
        <Text style={styles.sectionTitle}>最近学习记录</Text>
        <View style={styles.recentList}>
          {profileData.recentLearning.map(renderLearningRecord)}
        </View>

        {/* 设置入口 */}
        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={[styles.menuIcon, styles.menuIconBlue]}>
              <Icon name="Eye" size={20} color="#4F8EF7" />
            </View>
            <Text style={styles.menuLabel}>系统设置与隐私</Text>
            <View style={styles.menuArrow}>
              <Icon name="ArrowRight" size={18} color="#667085" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={[styles.menuIcon, styles.menuIconGray]}>
              <Icon name="Plus" size={20} color="#667085" />
            </View>
            <Text style={styles.menuLabel}>离线缓存管理</Text>
            <View style={styles.menuArrow}>
              <Icon name="ArrowRight" size={18} color="#667085" />
            </View>
          </TouchableOpacity>
        </View>

        {/* 登出按钮 */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
          <Text style={styles.logoutText}>退出当前企业账号</Text>
        </TouchableOpacity>

        {/* 底部安全间距 */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 底部导航栏 */}
      <BottomTabBar tabs={tabsWithHandlers} activeKey="profile" />
    </SafeAreaView>
  );
};

export default ProfileScreen;