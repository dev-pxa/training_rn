import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
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

/** 荣誉勋章数据 */
const MEDALS: Array<{
  id: number;
  name: string;
  bgColor: string;
  iconColor: string;
  iconName: any;
  locked?: boolean;
}> = [
  { id: 1, name: '初级认证', bgColor: '#FFFBEB', iconColor: '#F59E0B', iconName: 'Medal' },
  { id: 2, name: '效率达人', bgColor: '#EFF6FF', iconColor: '#3B82F6', iconName: 'Crown' },
  { id: 3, name: '全能工匠', bgColor: '#ECFDF5', iconColor: '#10B981', iconName: 'Reorder' },
  { id: 4, name: '神秘奖励', bgColor: '#F3F4F6', iconColor: '#9CA3AF', iconName: 'Star', locked: true },
];

/** 学习记录数据 */
const LEARNING_HISTORY = [
  {
    id: 1,
    courseName: '智慧安防：2026款传感器安装规范',
    lastWatched: '12分钟前',
    progress: 80,
    thumbnail: 'https://modao.cc/agent-py/media/generated_images/2026-03-08/03d7492f51664383a7f9fe8bb5904a46.jpg',
  },
  {
    id: 2,
    courseName: '云端协同方案实操视频',
    lastWatched: '2小时前',
    progress: 45,
    thumbnail: 'https://modao.cc/agent-py/media/generated_images/2026-03-08/097af12357444a9b84fb1d8a89b1b65d.jpg',
  },
  {
    id: 3,
    courseName: '工业级网关部署规范',
    lastWatched: '昨天',
    progress: 100,
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
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

  /** 渲染荣誉勋章 */
  const renderMedal = (medal: typeof MEDALS[0]) => (
    <View key={medal.id} style={styles.medalItem}>
      <View style={[styles.medalIconContainer, { backgroundColor: medal.bgColor }]}>
        <Icon name={medal.iconName} size={28} color={medal.iconColor} />
        {medal.locked && (
          <View style={styles.medalLockOverlay}>
            <Icon name="Star" size={12} color="#9CA3AF" />
          </View>
        )}
      </View>
      <Text style={[styles.medalName, medal.locked && styles.medalNameLocked]}>
        {medal.name}
      </Text>
    </View>
  );

  /** 渲染学习记录 */
  const renderLearningRecord = (record: typeof LEARNING_HISTORY[0]) => (
    <View key={record.id} style={styles.learningRecordItem}>
      <Image source={{ uri: record.thumbnail }} style={styles.learningThumbnail} />
      <View style={styles.learningInfo}>
        <Text style={styles.learningCourseName} numberOfLines={1}>
          {record.courseName}
        </Text>
        <View style={styles.learningMeta}>
          <Text style={styles.learningTime}>{record.lastWatched}</Text>
          <View style={styles.learningProgressBar}>
            <View style={[styles.learningProgressFill, { width: `${record.progress}%` }]} />
          </View>
        </View>
      </View>
      <Icon name="PlayCircle" size={32} color="#2563EB" />
    </View>
  );

  /** Tab 配置添加点击事件 */
  const tabsWithHandlers = PROFILE_TABS.map((tab) => ({
    ...tab,
    onPress: () => handleTabPress(tab.key),
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EFF6FF" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 头部信息 */}
        <View style={styles.headerGradient}>
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Image
                source={{
                  uri: 'https://modao.cc/agent-py/media/generated_images/2026-03-08/066a0b30f67b4d83ab5198333a5c7349.jpg',
                }}
                style={styles.avatar}
              />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>张小智</Text>
                <Text style={styles.userDept}>智能家居事业部 · 华东区</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>编辑</Text>
            </TouchableOpacity>
          </View>

          {/* 数据看板 */}
          <View style={styles.dashboard}>
            <View style={styles.dashboardItem}>
              <Text style={styles.dashboardValue}>126</Text>
              <Text style={styles.dashboardLabel}>累计学习时长</Text>
              <Text style={styles.dashboardUnit}>小时</Text>
            </View>
            <View style={styles.dashboardDivider} />
            <View style={styles.dashboardItem}>
              <Text style={styles.dashboardValue}>5</Text>
              <Text style={styles.dashboardLabel}>获得证书</Text>
              <Text style={styles.dashboardUnit}>张</Text>
            </View>
            <View style={styles.dashboardDivider} />
            <View style={styles.dashboardItem}>
              <Text style={styles.dashboardValue}>82</Text>
              <Text style={styles.dashboardLabel}>完成率</Text>
              <Text style={styles.dashboardUnit}>%</Text>
            </View>
          </View>
        </View>

        {/* 荣誉墙 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>我的荣誉</Text>
          <View style={styles.medalsContainer}>
            {MEDALS.map(renderMedal)}
          </View>
        </View>

        {/* 学习历史 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>最近学习记录</Text>
          <View style={styles.learningHistoryContainer}>
            {LEARNING_HISTORY.map(renderLearningRecord)}
          </View>
        </View>

        {/* 设置入口 */}
        <View style={styles.settingsContainer}>
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Icon name="Settings" size={24} color="#2563EB" />
              <Text style={styles.settingsItemText}>系统设置与隐私</Text>
            </View>
            <Icon name="ArrowRight" size={20} color="#D1D5DB" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Icon name="CloudDownload" size={24} color="#2563EB" />
              <Text style={styles.settingsItemText}>离线缓存管理</Text>
            </View>
            <Icon name="ArrowRight" size={20} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        {/* 登出按钮 */}
        <TouchableOpacity style={styles.logoutButton}>
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
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    backgroundColor: '#EFF6FF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: '#EFF6FF',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userDetails: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1F2937',
  },
  userDept: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '700',
    marginTop: 2,
  },
  editButton: {
    position: 'absolute',
    top: 16,
    right: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  editButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  dashboard: {
    flexDirection: 'row',
    marginHorizontal: 24,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dashboardItem: {
    flex: 1,
    alignItems: 'center',
  },
  dashboardValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1F2937',
  },
  dashboardLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  dashboardUnit: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  dashboardDivider: {
    width: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  medalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  medalItem: {
    alignItems: 'center',
  },
  medalIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  medalLockOverlay: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
  },
  medalName: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 8,
    fontWeight: '600',
  },
  medalNameLocked: {
    color: '#D1D5DB',
  },
  learningHistoryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
  },
  learningRecordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  learningThumbnail: {
    width: 48,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  learningInfo: {
    flex: 1,
    marginLeft: 12,
  },
  learningCourseName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  learningMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  learningTime: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  learningProgressBar: {
    marginLeft: 8,
    width: 60,
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
  },
  learningProgressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  settingsContainer: {
    marginTop: 24,
    marginHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemText: {
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 12,
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 24,
    marginHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
});

export default ProfileScreen;