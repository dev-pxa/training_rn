import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../../types/navigation';
import { Chapter, CourseDetail } from '../../types/coursePlayer';
import Icon, { IconName } from '../../components/Icons/Icon';
import VideoPlayer from '../../components/VideoPlayer';
import ErrorState from '../../components/ErrorState';
import { fetchCourseDetail, updatePlayProgress } from '../../services/api';
import { useFetchData } from '../../hooks/useFetchData';
import styles from './styles';

type CoursePlayerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CoursePlayer'>;
type CoursePlayerScreenRouteProp = RouteProp<RootStackParamList, 'CoursePlayer'>;

interface CoursePlayerScreenProps {
  navigation: CoursePlayerScreenNavigationProp;
  route: CoursePlayerScreenRouteProp;
}

type TabType = 'catalog' | 'notes' | 'questions';

// status 到 icon 的映射
const STATUS_ICON_MAP: Record<string, IconName | undefined> = {
  playing: 'Play',
  completed: 'CheckCircle',
  locked: 'Lock',
};

/**
 * 格式化时长（秒转为 "x小时x分钟x秒" 格式，0的单位不显示）
 * @param seconds 秒数
 * @returns 格式化后的时长字符串
 */
const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const parts: string[] = [];
  if (h > 0) {
    parts.push(`${h}小时`);
  }
  if (m > 0) {
    parts.push(`${m}分钟`);
  }
  if (s > 0 || parts.length === 0) {
    parts.push(`${s}秒`);
  }

  return parts.join('');
};

const CoursePlayerScreen: React.FC<CoursePlayerScreenProps> = ({ navigation, route }) => {
  const courseId = route.params?.courseId || '';
  const [activeTab, setActiveTab] = useState<TabType>('catalog');
  const [playingItemId, setPlayingItemId] = useState<number | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  /** 当前播放章节ID的 ref，用于在退出页面时获取最新值 */
  const playingItemIdRef = useRef<number | null>(null);
  /** 当前播放时间的 ref，用于在切换/退出时上报进度 */
  const currentTimeRef = useRef<number>(0);

  /** 上报播放进度 */
  const reportPlayProgress = useCallback((chapterId: number, playPosition: number) => {
    updatePlayProgress({
      courseId,
      chapterId,
      playPosition,
    }).catch(err => {
      console.warn('更新播放进度失败:', err);
    });
  }, [courseId]);

  /** 获取课程详情数据 */
  const { data, loading, error, fetchData } = useFetchData<CourseDetail>();

  useEffect(() => {
    if (courseId) {
      fetchData(() => fetchCourseDetail(courseId));
    }
  }, [courseId, fetchData]);

  /** 初始化播放章节 */
  useEffect(() => {
    if (data?.chapters && data.chapters.length > 0 && playingItemId === null) {
      // 尝试找到 currentChapterIndex 对应的章节
      let targetChapter = data.chapters[data.currentChapterIndex];
      let autoPlay = true;

      // 如果找不到，找最后一个 type 为 video 的章节
      if (!targetChapter) {
        const videoChapters = data.chapters.filter(c => c.type === 'video');
        targetChapter = videoChapters[videoChapters.length - 1];
        autoPlay = false;
      }

      // 如果还是找不到（没有video章节），使用第一个章节
      if (!targetChapter) {
        targetChapter = data.chapters[0];
        autoPlay = false;
      }

      setPlayingItemId(targetChapter.id);
      setShouldAutoPlay(autoPlay);
      setChapters(data.chapters);

      // 初始化 ref
      playingItemIdRef.current = targetChapter.id;
      currentTimeRef.current = targetChapter.initialTime;
    }
  }, [data, playingItemId]);

  /** 同步当前章节ID到 ref */
  useEffect(() => {
    playingItemIdRef.current = playingItemId;
  }, [playingItemId]);

  /** 退出页面时上报当前章节的播放进度 */
  useEffect(() => {
    return () => {
      if (playingItemIdRef.current !== null) {
        reportPlayProgress(playingItemIdRef.current, currentTimeRef.current);
      }
    };
  }, [reportPlayProgress]);

  /** 当前播放的章节 */
  const currentPlayingItem = useMemo(() => {
    return chapters.find(item => item.id === playingItemId) || chapters[0];
  }, [chapters, playingItemId]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleCatalogItemPress = (item: Chapter) => {
    if (item.status === 'locked') return;
    if (item.id === playingItemId) return;

    // 切换章节前，先上报上一个章节的播放进度
    if (playingItemId !== null) {
      reportPlayProgress(playingItemId, currentTimeRef.current);
    }

    // 切换播放的章节，不修改 status 字段
    setPlayingItemId(item.id);
    // 手动切换章节时自动播放
    setShouldAutoPlay(true);
    // 重置当前播放时间为新章节的初始时间
    currentTimeRef.current = item.initialTime;
  };

  /** 视频播放进度变化 */
  const handleVideoProgress = useCallback((currentTime: number) => {
    currentTimeRef.current = currentTime;
  }, []);

  const handleDownloadPress = () => {
    console.log('离线缓存');
  };

  const handleSharePress = () => {
    console.log('分享同事');
  };

  /** 获取章节元信息 */
  const getChapterMeta = (item: Chapter): string => {
    if (item.id === playingItemId) {
      return `正在播放`;
    }
    return `时长 ${formatDuration(item.spendTime)}`;
  };

  /** 渲染加载状态 */
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
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
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <ErrorState
          message={error || '数据加载失败'}
          onRetry={() => fetchData(() => fetchCourseDetail(courseId))}
          onGoHome={() => navigation.navigate('Home')}
        />
      </SafeAreaView>
    );
  }

  const renderCatalogItem = (item: Chapter, index: number) => {
    const isCurrentPlaying = item.id === playingItemId;
    const isCompleted = item.status === 'completed';
    const isLocked = item.status === 'locked';
    const iconName = STATUS_ICON_MAP[item.status];

    let indexBgColor = '#F8F9FB';
    let indexTextColor = '#8E8E93';
    let nameTextColor = '#1A1A1A';
    let metaTextColor = '#8E8E93';
    let iconColor = '#D1D5DB';

    // 只高亮当前播放的章节
    if (isCurrentPlaying) {
      indexBgColor = 'rgba(79, 142, 247, 0.12)';
      indexTextColor = '#4F8EF7';
      nameTextColor = '#4F8EF7';
      metaTextColor = 'rgba(79, 142, 247, 0.8)';
    }

    // completed 状态的 icon 为高亮色
    if (isCompleted) {
      iconColor = '#4F8EF7';
    }

    // 当前播放的章节 icon 也是高亮色
    if (isCurrentPlaying) {
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
            {getChapterMeta(item)}
          </Text>
        </View>
        <View style={styles.catalogIcon}>
          {iconName ? <Icon name={iconName} color={iconColor} size={26} /> : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* 播放器区域 - 固定 */}
      <View style={styles.playerSection}>
        <VideoPlayer
          key={currentPlayingItem?.id || 'default'}
          videoUrl={currentPlayingItem?.url || ''}
          initialTime={currentPlayingItem?.initialTime || 0}
          showBackButton={true}
          onBackPress={handleBack}
          autoPlay={shouldAutoPlay}
          onProgressChange={handleVideoProgress}
        />
      </View>

      {/* 课程简介 - 固定 */}
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle}>{data.title}</Text>
        <Text style={styles.courseHighlight}>{data.desc}</Text>
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

      {/* 标签切换 - 固定 */}
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

      {/* 内容区域 - 可滚动 */}
      <ScrollView style={styles.contentScrollView} showsVerticalScrollIndicator={false}>
        {/* 目录列表 */}
        {activeTab === 'catalog' && (
          <View style={styles.catalogSection}>
            {chapters.map(renderCatalogItem)}
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
