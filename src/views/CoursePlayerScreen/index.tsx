import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../../types/navigation';
import { Icon } from '../../components/Icons';
import VideoPlayer from '../../components/VideoPlayer';
import styles from './styles';

type CoursePlayerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CoursePlayer'>;
type CoursePlayerScreenRouteProp = RouteProp<RootStackParamList, 'CoursePlayer'>;

interface CoursePlayerScreenProps {
  navigation: CoursePlayerScreenNavigationProp;
  route: CoursePlayerScreenRouteProp;
}

type TabType = 'catalog' | 'notes' | 'questions';

interface CatalogItem {
  id: string;
  index: string;
  name: string;
  meta: string;
  status: 'playing' | 'completed' | 'locked';
  videoUrl: string;
  initialTime: number;
}

const CATALOG_DATA: CatalogItem[] = [
  {
    id: '1',
    index: '01',
    name: '基础：传感器工作原理',
    meta: '正在播放 08:45 / 15:20',
    status: 'playing',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    initialTime: 0,
  },
  {
    id: '2',
    index: '02',
    name: '部署：2026款硬件安装实操',
    meta: '时长 12分钟',
    status: 'completed',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    initialTime: 60,
  },
  {
    id: '3',
    index: '03',
    name: '进阶：多机联动信号补偿',
    meta: '时长 18分钟',
    status: 'locked',
    videoUrl: '',
    initialTime: 0,
  },
];

const CoursePlayerScreen: React.FC<CoursePlayerScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<TabType>('catalog');
  const [playingItemId, setPlayingItemId] = useState<string>(CATALOG_DATA[0].id);
  const [catalogData, setCatalogData] = useState<CatalogItem[]>(CATALOG_DATA);

  const currentPlayingItem = catalogData.find(item => item.id === playingItemId) || catalogData[0];

  const handleBack = () => {
    navigation.goBack();
  };

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleCatalogItemPress = (item: CatalogItem) => {
    if (item.status === 'locked') return;
    // 更新播放状态
    const updatedData = catalogData.map(catalogItem => {
      let newStatus: 'playing' | 'completed' | 'locked' = catalogItem.status;
      if (catalogItem.id === item.id) {
        newStatus = 'playing';
      } else if (catalogItem.status === 'playing') {
        newStatus = 'completed';
      }
      return { ...catalogItem, status: newStatus };
    });
    setCatalogData(updatedData);
    setPlayingItemId(item.id);
  };

  const handleDownloadPress = () => {
    console.log('离线缓存');
  };

  const handleSharePress = () => {
    console.log('分享同事');
  };

  const renderCatalogItem = (item: CatalogItem, index: number) => {
    const isPlaying = item.status === 'playing';
    const isCompleted = item.status === 'completed';
    const isLocked = item.status === 'locked';

    let indexBgColor = '#F8F9FB';
    let indexTextColor = '#8E8E93';
    let nameTextColor = '#1A1A1A';
    let metaTextColor = '#8E8E93';
    let iconColor = '#D1D5DB';

    if (isPlaying) {
      indexBgColor = 'rgba(79, 142, 247, 0.12)';
      indexTextColor = '#4F8EF7';
      nameTextColor = '#4F8EF7';
      metaTextColor = 'rgba(79, 142, 247, 0.8)';
      iconColor = '#4F8EF7';
    }

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.catalogItem, index > 0 && styles.catalogItemBorder]}
        onPress={() => handleCatalogItemPress(item)}
        activeOpacity={isLocked ? 1 : 0.7}
      >
        <View style={[styles.catalogIndex, { backgroundColor: indexBgColor }]}>
          <Text style={[styles.catalogIndexText, { color: indexTextColor }]}>
            {item.index}
          </Text>
        </View>
        <View style={styles.catalogContent}>
          <Text style={[styles.catalogName, { color: nameTextColor }]}>
            {item.name}
          </Text>
          <Text style={[styles.catalogMeta, { color: metaTextColor }]}>
            {item.meta}
          </Text>
        </View>
        <View style={styles.catalogIcon}>
          {isPlaying ? (
            <Icon name="Play" color={iconColor} size={26} />
          ) : isCompleted ? (
            <Icon name="CheckCircle" color={iconColor} size={26} />
          ) : (
            <Icon name="Lock" color={iconColor} size={26} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 播放器区域 */}
        <View style={styles.playerSection}>
          <VideoPlayer
            key={currentPlayingItem.id}
            videoUrl={currentPlayingItem.videoUrl}
            initialTime={currentPlayingItem.initialTime}
            showBackButton={true}
            onBackPress={handleBack}
          />
        </View>

        {/* 课程简介 */}
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle}>2026款传感核心组件安装规范</Text>
          <Text style={styles.courseHighlight}>
            本节重点：红外传感器的防死角部署与盲点规避。
          </Text>
          <View style={styles.courseActions}>
            <TouchableOpacity onPress={handleDownloadPress}>
              <LinearGradient
                colors={['#4F8EF7', '#7C6EFC']}
                style={styles.actionBtnPrimary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name="CloudDownload" color="white" size={18} />
                <Text style={styles.actionBtnPrimaryText}>离线缓存</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtnSecondary} onPress={handleSharePress}>
              <Icon name="Share" color="#1A1A1A" size={18} />
              <Text style={styles.actionBtnSecondaryText}>分享同事</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 标签切换 */}
        <View style={styles.tabsSection}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'catalog' && styles.tabItemActive]}
            onPress={() => handleTabPress('catalog')}
          >
            <Text style={[styles.tabText, activeTab === 'catalog' && styles.tabTextActive]}>
              课程目录
            </Text>
            {activeTab === 'catalog' && (
              <LinearGradient
                colors={['#4F8EF7', '#7C6EFC']}
                style={styles.tabIndicator}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'notes' && styles.tabItemActive]}
            onPress={() => handleTabPress('notes')}
          >
            <Text style={[styles.tabText, activeTab === 'notes' && styles.tabTextActive]}>
              写笔记
            </Text>
            <Text style={[styles.tabBadge, activeTab === 'notes' && styles.tabBadgeActive]}>
              (12)
            </Text>
            {activeTab === 'notes' && (
              <LinearGradient
                colors={['#4F8EF7', '#7C6EFC']}
                style={styles.tabIndicator}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'questions' && styles.tabItemActive]}
            onPress={() => handleTabPress('questions')}
          >
            <Text style={[styles.tabText, activeTab === 'questions' && styles.tabTextActive]}>
              课堂提问
            </Text>
            {activeTab === 'questions' && (
              <LinearGradient
                colors={['#4F8EF7', '#7C6EFC']}
                style={styles.tabIndicator}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* 目录列表 */}
        {activeTab === 'catalog' && (
          <View style={styles.catalogSection}>
            {catalogData.map(renderCatalogItem)}
          </View>
        )}

        {/* 其他标签内容占位 */}
        {activeTab !== 'catalog' && (
          <View style={styles.placeholderSection}>
            <Text style={styles.placeholderText}>
              {activeTab === 'notes' ? '笔记功能开发中...' : '提问功能开发中...'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CoursePlayerScreen;
