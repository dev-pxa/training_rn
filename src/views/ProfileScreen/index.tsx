import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import BottomTabBar, { TabItem } from '../../components/BottomTabBar';
import { RootStackParamList } from '../../types/navigation';
import { Icon } from '../../components/Icons';
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

export default ProfileScreen;