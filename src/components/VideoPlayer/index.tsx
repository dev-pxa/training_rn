/**
 * TODO: 关于鸿蒙支持
 react-native-video 不支持鸿蒙，如需鸿蒙适配建议：
 抽象 VideoPlayer 接口
 鸿蒙端使用 @react-native-ohos/video 或原生 Video 组件

 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Modal } from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from '../Icons';
import { styles } from './styles';

/** 播放速率选项数组 - 定义播放器支持的所有播放速度 */
const PLAYBACK_RATES = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

/** 快进/快退的时间步长（秒） - 每次点击快进或快退按钮跳过的秒数 */
const SEEK_STEP = 5;

/** 控制栏自动隐藏的延迟时间（毫秒）- 用户无操作后多少毫秒自动隐藏控制栏 */
const HIDE_CONTROLS_DELAY = 5000;

/** 双击检测的时间间隔（毫秒）- 两次点击间隔小于此值视为双击操作 */
const DOUBLE_TAP_DELAY = 300;

/** VideoPlayer 组件的属性接口 - 定义组件可以接受的参数类型 */
interface VideoPlayerProps {
  /** 视频资源 URL - 要播放的视频文件的网络地址 */
  videoUrl: string;
  /** 初始播放时间位置（秒），用于从指定位置开始播放 - 视频开始播放时的起始时间点 */
  initialTime?: number;
  /** 全屏状态变化回调函数 - 当用户进入或退出全屏时会调用此函数 */
  onFullscreenChange?: (isFullscreen: boolean) => void;
  /** 是否显示返回按钮 - 控制播放器左上角是否显示返回图标 */
  showBackButton?: boolean;
  /** 返回按钮点击回调 - 用户点击返回按钮时执行的操作 */
  onBackPress?: () => void;
  /** 是否自动播放 - 视频加载完成后是否自动开始播放 */
  autoPlay?: boolean;
  /** 播放进度变化回调 - 当前播放时间变化时触发 */
  onProgressChange?: (currentTime: number) => void;
}

/**
 * VideoPlayer 视频播放器组件
 * 支持播放/暂停、快进快退、进度拖拽、全屏切换、播放速率调节等功能
 *
 * 【核心设计方案说明】
 *
 * 问题背景：
 * - 使用 react-native-video 内置的 fullscreen 属性会导致 Video 组件进入原生全屏模式
 * - 在原生全屏模式下，React Native 组件无法覆盖在视频上方，导致点击切换控制栏功能失效
 *
 * 解决方案：
 * - 方案1：使用 React Native 的 Modal 组件实现全屏效果，而不是 Video 组件的内置全屏
 * - 方案2：同时渲染两个 Video 组件实例（普通模式一个，全屏模式一个），通过条件渲染控制显示
 * - 方案3：使用 useRef 保存播放位置，全屏切换时通过 seek 方法恢复进度
 * - 方案4：创建两个独立的 onProgress 回调，根据 isFullscreen 状态决定哪个回调更新时间
 *
 * 解决的问题：
 * 1. 全屏状态下点击视频任意位置可以正常切换控制栏显示/隐藏
 * 2. 全屏状态下点击左上角返回按钮先退出全屏，非全屏才返回上一页
 * 3. 全屏切换时保持播放进度，不会从头播放
 * 4. 两个 Video 组件不会互相干扰，不会导致播放时间卡在 1 秒
 */
const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  initialTime = 0,
  onFullscreenChange,
  showBackButton = false,
  onBackPress,
  autoPlay = false,
  onProgressChange,
}) => {
  // ========== 状态定义 ==========

  /** Video 组件的引用 - 用于调用 Video 组件的实例方法，如 seek */
  const videoRef = useRef<any>(null);

  /** 上次点击的时间，用于检测双击 - 记录上一次点击视频区域的时间戳 */
  const lastTapTimeRef = useRef<number>(0);

  /** 保存视频播放位置，在全屏切换时恢复 - 使用 useRef 而不是 useState 是为了避免触发重渲染 */
  const savedTimeRef = useRef<number>(initialTime);

  /** 是否暂停播放 - 控制视频播放还是暂停的状态变量 */
  const [paused, setPaused] = useState(!autoPlay);

  /** 播放速率，1.0 表示正常速度 - 控制视频播放的快慢 */
  const [rate, setRate] = useState(1.0);

  /** 当前播放时间位置（秒）- 显示在进度条左侧的当前播放时间 */
  const [currentTime, setCurrentTime] = useState(initialTime);

  /** 视频总时长（秒）- 显示在进度条右侧的视频总长度 */
  const [duration, setDuration] = useState(0);

  /** 是否处于全屏模式 - 控制播放器显示为普通模式还是全屏模式 */
  const [isFullscreen, setIsFullscreen] = useState(false);

  /** 是否显示控制栏 - 控制底部进度条、快进快退等控件是否可见 */
  const [showControls, setShowControls] = useState(true);

  /** 是否显示播放速率选择气泡 - 控制倍速选择气泡的显示和隐藏 */
  const [showRateBubble, setShowRateBubble] = useState(false);

  /** 标记当前是在哪个模式（全屏/非全屏）点击的速率按钮 */
  const rateBubbleModeRef = useRef<'normal' | 'fullscreen'>('normal');

  /** 是否显示中央播放按钮 - 控制屏幕中央的大播放按钮是否显示 */
  const [showCenterPlay, setShowCenterPlay] = useState(!autoPlay);

  /** 视频是否播放完毕 - 标记视频是否已经播放到结尾 */
  const [isEnded, setIsEnded] = useState(false);

  /** 自动隐藏控制栏的定时器引用 - 用于清除之前的定时器，避免多个定时器同时运行 */
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout>>(null);

  // ========== 定时器管理 ==========

  /**
   * 重置并启动控制栏自动隐藏定时器
   * 规则：
   * 1. 显示控制栏
   * 2. 如果正在播放且未结束，启动定时器，5秒后隐藏控制栏
   * 3. 如果暂停或已结束，清除定时器，控制栏保持显示
   */
  const resetHideControlsTimer = useCallback(() => {
    // 如果已有定时器在运行，先清除它，避免多个定时器同时生效
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }

    // 立即显示控制栏
    setShowControls(true);

    // 只有在视频正在播放且未播放完毕时，才启动自动隐藏定时器
    if (!paused && !isEnded) {
      // 设置一个 5 秒后的定时器，到时自动隐藏控制栏
      hideControlsTimer.current = setTimeout(() => {
        setShowControls(false);
      }, HIDE_CONTROLS_DELAY);
    }
  }, [paused, isEnded]);

  /** 组件挂载时初始化定时器，组件卸载时清除定时器防止内存泄漏 */
  useEffect(() => {
    // 初始化时启动定时器
    resetHideControlsTimer();

    // 组件卸载时的清理函数
    return () => {
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }
    };
  }, [resetHideControlsTimer]);

  /** 监听播放状态和结束状态的变化，重新设置定时器 */
  useEffect(() => {
    resetHideControlsTimer();
  }, [paused, isEnded, resetHideControlsTimer]);

  // ========== 视频切换处理 ==========

  /** 当视频 URL 或初始时间变化时，重置播放器状态 */
  useEffect(() => {
    // 重置当前播放时间为新的初始时间
    setCurrentTime(initialTime);
    // 根据 autoPlay 决定是否暂停视频播放
    setPaused(!autoPlay);
    // 根据 autoPlay 决定是否显示中央播放按钮
    setShowCenterPlay(!autoPlay);
    // 重置播放结束状态
    setIsEnded(false);
    // 保存初始时间到 ref 中
    savedTimeRef.current = initialTime;
  }, [videoUrl, initialTime, autoPlay]);

  // ========== 全屏切换时恢复播放位置 ==========

  /**
   * 监听全屏状态变化，当 Video 组件重新挂载后，恢复播放位置
   * 关键逻辑：
   * - 当 isFullscreen 变化时，会导致其中一个 Video 组件卸载，另一个挂载
   * - 新挂载的 Video 组件需要手动 seek 到之前保存的播放位置
   */
  useEffect(() => {
    // 只有当保存的播放时间大于 0 时才执行恢复操作
    if (savedTimeRef.current > 0) {
      // 延迟 100 毫秒执行 seek，确保 Video 组件已经完成挂载
      setTimeout(() => {
        videoRef.current?.seek(savedTimeRef.current);
      }, 100);
    }
  }, [isFullscreen]);

  // ========== 工具函数 ==========

  /**
   * 将秒数格式化为 mm:ss 格式
   * @param seconds - 要格式化的秒数
   * @returns 格式化后的时间字符串，如 "03:45"
   */
  const formatTime = (seconds: number): string => {
    // 计算分钟数：总秒数除以 60，向下取整
    const mins = Math.floor(seconds / 60);
    // 计算剩余秒数：总秒数对 60 取模，向下取整
    const secs = Math.floor(seconds % 60);
    // 格式化输出：分钟和秒都用两位数字表示，不足两位前面补 0
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ========== 播放控制 ==========

  /**
   * 切换播放/暂停状态
   * 两种情况：
   * 1. 视频已播放完毕 -> 点击从头开始播放
   * 2. 视频正在播放或暂停 -> 切换播放状态
   */
  const togglePlay = useCallback(() => {
    // 如果视频已经播放完毕
    if (isEnded) {
      // 跳转到视频起始位置
      videoRef.current?.seek(0);
      // 重置当前播放时间为 0
      setCurrentTime(0);
      // 重置播放结束状态
      setIsEnded(false);
      // 开始播放
      setPaused(false);
      // 隐藏中央播放按钮
      setShowCenterPlay(false);
    } else {
      // 如果视频未播放完毕，切换播放/暂停状态
      setPaused((prev) => {
        // 计算新的暂停状态
        const newPaused = !prev;
        // 中央播放按钮的显示状态与暂停状态一致：暂停时显示，播放时隐藏
        setShowCenterPlay(newPaused);
        // 返回新的暂停状态
        return newPaused;
      });
    }
    // 操作完成后重置自动隐藏定时器，确保控制栏保持显示一段时间
    resetHideControlsTimer();
  }, [isEnded, resetHideControlsTimer]);

  // ========== 快进快退 ==========

  /**
   * 快进操作 - 向前跳过指定时间
   */
  const handleSeekForward = useCallback(() => {
    // 计算新的播放位置：当前时间 + 快进步长，不超过视频总时长
    const newTime = Math.min(currentTime + SEEK_STEP, duration);
    // 调用 Video 组件的 seek 方法跳转到新位置
    videoRef.current?.seek(newTime);
    // 更新当前播放时间状态
    setCurrentTime(newTime);
    // 保存新的播放时间到 ref 中，用于全屏切换时恢复
    savedTimeRef.current = newTime;
    // 重置自动隐藏定时器
    resetHideControlsTimer();
  }, [currentTime, duration, resetHideControlsTimer]);

  /**
   * 快退操作 - 向后回退指定时间
   */
  const handleSeekBackward = useCallback(() => {
    // 计算新的播放位置：当前时间 - 快退步长，不小于 0
    const newTime = Math.max(currentTime - SEEK_STEP, 0);
    // 调用 Video 组件的 seek 方法跳转到新位置
    videoRef.current?.seek(newTime);
    // 更新当前播放时间状态
    setCurrentTime(newTime);
    // 保存新的播放时间到 ref 中，用于全屏切换时恢复
    savedTimeRef.current = newTime;
    // 重置自动隐藏定时器
    resetHideControlsTimer();
  }, [currentTime, resetHideControlsTimer]);

  // ========== 进度和加载回调 ==========

  /**
   * 非全屏模式下的进度更新回调
   * 关键设计：只有在非全屏状态下才更新时间，避免两个 Video 组件的回调互相干扰
   *
   * 问题背景：
   * - 之前两个 Video 组件共享同一个 onProgress 回调
   * - 导致两个组件会同时更新 currentTime，造成时间冲突，视频卡在 1 秒
   *
   * 解决方案：
   * - 创建两个独立的回调函数
   * - 每个回调函数内部检查当前是否处于对应的显示状态
   * - 只有当前状态匹配时才更新时间
   */
  const handleProgressNormal = useCallback((data: { currentTime: number }) => {
    // 只有在非全屏状态下，才更新当前播放时间
    if (!isFullscreen) {
      setCurrentTime(data.currentTime);
      savedTimeRef.current = data.currentTime;
      onProgressChange?.(data.currentTime);
    }
  }, [isFullscreen, onProgressChange]);

  /**
   * 全屏模式下的进度更新回调
   * 关键设计：只有在全屏状态下才更新时间，避免两个 Video 组件的回调互相干扰
   */
  const handleProgressFullscreen = useCallback((data: { currentTime: number }) => {
    // 只有在全屏状态下，才更新当前播放时间
    if (isFullscreen) {
      setCurrentTime(data.currentTime);
      savedTimeRef.current = data.currentTime;
      onProgressChange?.(data.currentTime);
    }
  }, [isFullscreen, onProgressChange]);

  /**
   * 视频加载完成回调 - 获取视频总时长，如果指定了初始播放时间则跳转
   */
  const handleLoad = useCallback((data: { duration: number }) => {
    // 保存视频总时长
    setDuration(data.duration);
    // 只有初始加载时才跳转到初始时间，避免每次全屏切换都重新跳转
    if (initialTime > 0 && currentTime === 0) {
      videoRef.current?.seek(initialTime);
    }
  }, [initialTime, currentTime]);

  /**
   * 视频播放结束回调 - 视频播放到结尾时执行
   */
  const handleEnd = useCallback(() => {
    // 标记视频已播放结束
    setIsEnded(true);
    // 暂停视频播放
    setPaused(true);
    // 显示中央播放按钮
    setShowCenterPlay(true);
    // 显示控制栏
    setShowControls(true);
    // 清除自动隐藏定时器，因为视频已结束不需要自动隐藏
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }
  }, []);

  // ========== 全屏切换 ==========

  /**
   * 切换全屏/退出全屏模式
   * 步骤：
   * 1. 根据当前状态决定切换方向
   * 2. 锁定屏幕方向（进入全屏锁定横屏，退出锁定竖屏）
   * 3. 更新全屏状态
   * 4. 触发回调通知父组件
   * 5. 重置自动隐藏定时器
   */
  const toggleFullscreen = useCallback(() => {
    // 切换前先保存当前播放位置
    savedTimeRef.current = currentTime;

    // 如果当前是全屏状态，退出全屏，锁定为竖屏
    if (isFullscreen) {
      Orientation.lockToPortrait();
      setShowRateBubble(false);
    } else {
      // 如果当前不是全屏状态，进入全屏，锁定为横屏
      Orientation.lockToLandscape();
    }

    // 切换全屏状态：true 变 false，false 变 true
    setIsFullscreen((prev) => !prev);

    // 触发回调函数，通知父组件全屏状态已改变
    onFullscreenChange?.(!isFullscreen);

    // 重置自动隐藏定时器
    resetHideControlsTimer();
  }, [isFullscreen, currentTime, setShowRateBubble,onFullscreenChange, resetHideControlsTimer]);

  /**
   * 处理返回按钮点击
   * 全屏状态下：退出全屏
   * 非全屏状态下：调用 onBackPress 返回上一页
   */
  const handleBackPress = useCallback((event: any) => {
    // 阻止事件冒泡，避免触发射击视频区域的逻辑
    // 重要：如果不阻止冒泡，点击返回按钮时也会触发 handleVideoPress
    event?.stopPropagation?.();

    // 如果当前是全屏状态
    if (isFullscreen) {
      // 全屏状态下点击返回，先退出全屏
      toggleFullscreen();
    } else {
      // 非全屏状态下，调用传入的返回回调
      onBackPress?.();
    }
  }, [isFullscreen, onBackPress, toggleFullscreen]);

  // ========== 播放速率 ==========

  /**
   * 修改播放速率 - 用户选择倍速时执行
   */
  const handleRateChange = useCallback((newRate: number) => {
    // 更新播放速率状态
    setRate(newRate);
    // 隐藏播放速率选择气泡
    setShowRateBubble(false);
    // 重置自动隐藏定时器
    resetHideControlsTimer();
  }, [resetHideControlsTimer]);

  // ========== 控制栏显示/隐藏 ==========

  /**
   * 视频区域点击处理
   * 单击：切换控制栏的显示/隐藏状态
   * 双击：切换播放状态（暂停/播放）
   */
  const handleVideoPress = useCallback(() => {
    // 获取当前时间戳
    const now = Date.now();
    // 计算距离上次点击的时间间隔
    const timeSinceLastTap = now - lastTapTimeRef.current;

    // 如果时间间隔小于 300 毫秒，视为双击操作
    if (timeSinceLastTap < DOUBLE_TAP_DELAY) {
      // 双击：切换播放/暂停状态
      togglePlay();
      // 重置上次点击时间为 0，避免连续触发
      lastTapTimeRef.current = 0;
    } else {
      // 单击：切换控制栏显示/隐藏
      if (showControls) {
        // 如果控制栏当前显示中，点击隐藏
        setShowControls(false);
        // 清除自动隐藏定时器，因为已经手动隐藏了
        if (hideControlsTimer.current) {
          clearTimeout(hideControlsTimer.current);
        }
      } else {
        // 如果控制栏当前隐藏中，点击显示
        resetHideControlsTimer();
      }
      // 记录这次点击的时间
      lastTapTimeRef.current = now;
    }
  }, [showControls, resetHideControlsTimer, togglePlay]);

  // ========== 进度条拖拽 ==========

  /**
   * 进度条点击处理，跳转到指定位置
   * 步骤：
   * 1. 获取点击位置相对于进度条的比例
   * 2. 计算对应的播放时间
   * 3. 跳转到该时间点
   * 4. 更新当前时间状态
   * @param event - 点击事件，包含位置信息
   */
  const handleProgressPress = useCallback((event: any) => {
    // 阻止事件冒泡，避免触发射击视频区域的逻辑
    event?.stopPropagation?.();
    // 如果视频总时长还未加载完成，不处理
    if (duration <= 0) return;

    // 从原生事件中获取点击信息
    const { nativeEvent } = event;
    // 获取点击位置距离进度条左侧的距离
    const { layoutX, layoutWidth } = nativeEvent;
    // 计算点击位置占进度条总宽度的比例
    const percentage = layoutX / layoutWidth;
    // 根据比例计算对应的播放时间
    const newTime = percentage * duration;

    // 跳转到新的播放位置
    videoRef.current?.seek(newTime);
    // 更新当前播放时间状态
    setCurrentTime(newTime);
    // 保存新的播放时间到 ref 中，用于全屏切换时恢复
    savedTimeRef.current = newTime;
    // 重置自动隐藏定时器
    resetHideControlsTimer();
  }, [duration, resetHideControlsTimer]);

  // ========== 计算属性 ==========

  /** 计算进度条填充百分比，用于显示进度 - 已播放时间除以总时长乘以 100 */
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // ========== 渲染播放器 UI（不含 Video） ==========

  /**
   * 渲染播放器 UI（不包含 Video 组件本身）
   * 这个函数封装了所有 UI 控件的渲染，避免代码重复
   */
  const renderPlayerUI = () => (
    <>
      {/* 透明点击层，覆盖在视频上方，用于捕获点击事件 - zIndex 设置为 2，确保在视频上方但在其他控制元素下方 */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleVideoPress}
        style={styles.touchOverlay}
      />

      {/* 返回按钮 - 仅在显示控制栏且 showBackButton 为 true 时显示 */}
      {showControls && showBackButton && (
        <TouchableOpacity style={styles.backBtn} onPress={handleBackPress}>
          <Icon name="Back" color="white" size={22} />
        </TouchableOpacity>
      )}

      {/* 中央播放/重新播放按钮 - 显示条件：初始状态 OR (控制栏显示中且暂停) */}
      {(showCenterPlay || (showControls && paused)) && (
        <TouchableOpacity style={styles.playCenter} onPress={togglePlay}>
          <View style={styles.playBtn}>
            {/* 根据状态显示不同图标：播放结束显示重新播放图标，否则显示播放图标 */}
            {isEnded ? (
              <Icon name="Refresh" color="white" size={28} />
            ) : (
              <Icon name="Play" color="white" size={28} />
            )}
          </View>
        </TouchableOpacity>
      )}

      {/* 暂停时显示的透明覆盖层 - 作用：在视频暂停但中央按钮已隐藏时，点击视频任意位置恢复播放 */}
      {/* 显示条件：暂停中且中央按钮已隐藏且未播放结束 */}
      {paused && !showCenterPlay && !isEnded && (
        <TouchableOpacity style={styles.pauseOverlay} onPress={togglePlay} />
      )}

      {/* 进度条和控制区域 - 仅在显示控制栏时渲染 */}
      {showControls && (
        <View style={[styles.progressArea, isFullscreen && styles.progressAreaFullscreen]}>
          {/* 底部渐变遮罩，从底部向上渐变透明，增加文字对比度 */}
          <LinearGradient
            colors={['rgba(0,0,0,0.85)', 'transparent']}
            style={styles.progressGradient}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
          />

          {/* 进度条容器：包含时间标签和进度条 */}
          <View style={styles.progressBarContainer}>
            {/* 当前播放时间 */}
            <Text style={styles.timeLabel}>{formatTime(currentTime)}</Text>

            {/* 可点击的进度条 */}
            <TouchableOpacity
              style={styles.progressTrack}
              onPress={handleProgressPress}
              activeOpacity={0.7}
            >
              {/* 进度填充条（渐变）- 宽度根据播放进度动态计算 */}
              <LinearGradient
                colors={['#4F8EF7', '#7C6EFC']}
                style={[styles.progressFill, { width: `${progressPercent}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
              {/* 进度点（可选的视觉标记）- 两个装饰点 */}
              <View style={[styles.progressDot, { left: '25%' }]} />
              <View style={[styles.progressDot, { left: '75%' }]} />
            </TouchableOpacity>

            {/* 视频总时长 */}
            <Text style={styles.timeLabel}>{formatTime(duration)}</Text>
          </View>

          {/* 控制按钮区域：包含快退、快进、倍速、全屏 */}
          <View style={styles.playerControls}>
            {/* 左侧：快退、播放/暂停、快进按钮 */}
            <View style={styles.controlsLeft}>
              <TouchableOpacity onPress={handleSeekBackward}>
                <Icon name="SkipPrev" color="rgba(255,255,255,0.9)" size={24} />
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePlay}>
                {paused ? (
                  <Icon name="Play" color="rgba(255,255,255,0.9)" size={24} />
                ) : (
                  <Icon name="Pause" color="rgba(255,255,255,0.9)" size={24} />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSeekForward}>
                <Icon name="SkipNext" color="rgba(255,255,255,0.9)" size={24} />
              </TouchableOpacity>
            </View>

            {/* 右侧：倍速按钮、画质按钮、全屏按钮 - 仅全屏显示倍速按钮 */}
            <View style={styles.controlsRight}>
              {/* 播放速率按钮 - 仅在全屏模式下显示 */}
              {isFullscreen && (
                <View style={styles.rateButtonWrapper}>
                  <TouchableOpacity style={styles.controlPill} onPress={(e) => {
                    e.stopPropagation();
                    setShowRateBubble(!showRateBubble);
                  }}>
                    <Text style={styles.controlPillText}>
                      {rate.toFixed(2).replace('.00', '').replace(/0$/, '')}X
                    </Text>
                  </TouchableOpacity>

                  {/* 播放速率选择气泡 - 在按钮上方 */}
                  {showRateBubble && (
                    <View style={styles.rateBubble}>
                      {/* 渲染速率选项列表 - 从慢到快排列 */}
                      {PLAYBACK_RATES.map((r) => (
                        <TouchableOpacity
                          key={r}
                          style={[styles.rateBubbleOption, rate === r && styles.rateBubbleOptionActive]}
                          onPress={(e) => { e.stopPropagation(); handleRateChange(r); }}
                        >
                          <Text style={[styles.rateBubbleOptionText, rate === r && styles.rateBubbleOptionTextActive]}>
                            {r.toFixed(2).replace('.00', '').replace(/0$/, '')}X
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              )}

              {/* 画质按钮（固定显示 1080P）- 占位控件，暂未实现功能 */}
              <View style={styles.controlPill}>
                <Text style={styles.controlPillText}>1080P</Text>
              </View>
              {/* 全屏切换按钮 - 阻止事件冒泡避免触发射击视频区域 */}
              <TouchableOpacity onPress={(e) => { e.stopPropagation(); toggleFullscreen(); }}>
                <Icon name="Maximize" color="rgba(255,255,255,0.9)" size={22} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );

  /**
   * 处理点击外部关闭速率气泡
   * 通过包装整个播放器区域，点击除气泡外的区域时关闭气泡
   */
  const handleOutsidePress = useCallback(() => {
    if (showRateBubble) {
      setShowRateBubble(false);
    }
  }, [showRateBubble]);

  // ========== 渲染 - 用 Modal 实现全屏，各自独立的进度回调 ==========

  return (
    <>
      {/* 非全屏模式容器 - 始终在文档流中保持占位，避免布局跳动 */}
      {/* 使用 TouchableOpacity 包装，点击外部区域时关闭速率气泡 */}
      <TouchableOpacity style={styles.container} activeOpacity={1} onPress={handleOutsidePress}>
        <View style={styles.videoWrapper}>
          {/* 非全屏模式的 Video 组件 - 仅在 !isFullscreen 时渲染 */}
          {/* 关键：使用 handleProgressNormal 回调，只在非全屏时更新时间 */}
          {!isFullscreen && (
            <Video
              ref={videoRef}
              source={{ uri: videoUrl }}
              style={styles.video}
              paused={paused}
              rate={rate}
              resizeMode="contain"
              onProgress={handleProgressNormal}
              onLoad={handleLoad}
              onEnd={handleEnd}
              progressUpdateInterval={250}
            />
          )}
          {/* 非全屏模式的 UI - 仅在 !isFullscreen 时渲染 */}
          {!isFullscreen && renderPlayerUI()}
        </View>
      </TouchableOpacity>

      {/* 全屏模式使用 Modal - 这是实现真正全屏的关键 */}
      {/* 关键：不使用 react-native-video 内置的 fullscreen 属性，避免原生全屏覆盖 RN 组件 */}
      <Modal
        visible={isFullscreen}
        transparent={false}
        animationType="fade"
        onRequestClose={toggleFullscreen}
        supportedOrientations={['landscape']}
        statusBarTranslucent
      >
        {/* 全屏状态下隐藏状态栏 */}
        <StatusBar hidden />
        {/* 使用 TouchableOpacity 包装全屏区域，点击外部区域时关闭速率气泡 */}
        <TouchableOpacity style={styles.containerFullscreen} activeOpacity={1} onPress={handleOutsidePress}>
          <View style={styles.videoWrapper}>
            {/* 全屏模式的 Video 组件 - 始终在 Modal 中渲染 */}
            {/* 关键：使用 handleProgressFullscreen 回调，只在全屏时更新时间 */}
            <Video
              ref={videoRef}
              source={{ uri: videoUrl }}
              style={styles.video}
              paused={paused}
              rate={rate}
              resizeMode="contain"
              onProgress={handleProgressFullscreen}
              onLoad={handleLoad}
              onEnd={handleEnd}
              progressUpdateInterval={250}
            />
            {/* 全屏模式的 UI - 始终渲染 */}
            {renderPlayerUI()}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default VideoPlayer;
