import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import BottomTabBar, { TabItem } from '../components/BottomTabBar';
import { RootStackParamList } from '../types/navigation';
import { Icon } from '../components/Icons';

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

/** 学习记录数据 */
const LEARNING_HISTORY = [
  {
    id: 1,
    courseName: '智慧安防：2024传感器安装规范',
    lastWatched: '12分钟前',
    emoji: '🎓',
  },
  {
    id: 2,
    courseName: '云端协同方案实操视频',
    lastWatched: '2小时前',
    emoji: '🔧',
  },
  {
    id: 3,
    courseName: '工业网关部署规范',
    lastWatched: '昨天',
    emoji: '👷',
  },
];

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  /** 当前激活的 Tab */
  const [activeTab, setActiveTab] = useState('profile');

  /** Tab 点击处理 */
  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);
    console.log('切换 Tab:', tabKey);
    if (tabKey === 'home') {
      navigation.navigate('Home');
    }
  };

  /** 渲染学习记录 */
  const renderLearningRecord = (record: typeof LEARNING_HISTORY[0]) => (
    <TouchableOpacity key={record.id} style={styles.learningRecordItem} activeOpacity={0.7}>
      <LinearGradient
        colors={['#667EEA', '#764BA2']}
        style={styles.learningThumbnail}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.learningEmoji}>{record.emoji}</Text>
      </LinearGradient>
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />

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
            <View style={styles.statItem}>
              <Text style={styles.statValue}>126</Text>
              <Text style={styles.statLabel}>累计学习时长</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>获得证书</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>82</Text>
              <Text style={styles.statLabel}>完成率</Text>
            </View>
          </View>
        </View>

        {/* 学习历史 */}
        <Text style={styles.sectionTitle}>最近学习记录</Text>
        <View style={styles.recentList}>
          {LEARNING_HISTORY.map(renderLearningRecord)}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    shadowColor: '#4F8EF7',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 8,
  },
  avatarGradient: {
    width: 72,
    height: 72,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userDetails: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.01,
  },
  userRole: {
    fontSize: 14,
    color: '#667085',
    marginTop: 4,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#E7E8EE',
  },
  editButtonText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#667085',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  recentList: {
    marginBottom: 24,
  },
  learningRecordItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  learningThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#667EEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  learningEmoji: {
    fontSize: 20,
  },
  learningInfo: {
    flex: 1,
    marginLeft: 16,
  },
  learningCourseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  learningTime: {
    fontSize: 12,
    color: '#667085',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconBlue: {
    backgroundColor: '#F0F5FF',
  },
  menuIconGray: {
    backgroundColor: '#F4F5F7',
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginLeft: 16,
  },
  menuArrow: {
    flexShrink: 0,
  },
  logoutButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#FEEFEF',
    borderRadius: 20,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
});

export default ProfileScreen;