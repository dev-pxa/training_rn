import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  /** 容器样式（竖屏模式） */
  container: {
    position: 'relative',
    backgroundColor: '#000000',
    aspectRatio: 16 / 9,
    width: '100%',
  },

  /** 全屏模式容器样式 */
  containerFullscreen: {
    position: 'relative',
    backgroundColor: '#000000',
    width: '100%',
    height: '100%',
  },

  /** 视频包装器 */
  videoWrapper: {
    width: '100%',
    height: '100%',
  },

  /** 视频元素样式 */
  video: {
    width: '100%',
    height: '100%',
  },

  /** 透明点击覆盖层 */
  touchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2
  },

  /** 返回按钮样式 */
  backBtn: {
    position: 'absolute',
    top: 54,
    left: 16,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  /** 中央播放按钮容器 */
  playCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },

  /** 中央播放按钮样式（蒙版背景） */
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },

  /** 暂停时透明覆盖层 */
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 4,
  },

  /** 进度条和控制区域容器 */
  progressArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    zIndex: 10,
  },

  /** 全屏状态下的进度条和控制区域容器 - 增加底部 padding 避免屏幕圆角遮挡 */
  progressAreaFullscreen: {
    paddingBottom: 40,
  },

  /** 底部渐变遮罩 */
  progressGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  /** 进度条容器 */
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  /** 时间标签样式 */
  timeLabel: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '500',
    minWidth: 40,
  },

  /** 进度条轨道（背景） */
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 2,
    position: 'relative',
  },

  /** 进度条填充（已播放部分） */
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },

  /** 进度点样式 */
  progressDot: {
    position: 'absolute',
    top: -2,
    width: 8,
    height: 8,
    backgroundColor: '#FBBF24',
    borderRadius: 4,
  },

  /** 控制按钮行容器 */
  playerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },

  /** 左侧控制按钮组 */
  controlsLeft: {
    flexDirection: 'row',
    gap: 20,
  },

  /** 右侧控制按钮组 */
  controlsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  /** 控制按钮胶囊样式 */
  controlPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  /** 控制按钮胶囊文字样式 */
  controlPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  /** 速率按钮容器 - 用于气泡定位 */
  rateButtonWrapper: {
    position: 'relative',
    zIndex: 100,
  },

  /** 速率选择气泡 - 基础样式 */
  rateBubble: {
    position: 'absolute',
    bottom: '100%',
    right: 0,
    marginBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 4,
    minWidth: 70,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
  },

  /** 气泡在按钮下方时的样式（非全屏模式） */
  rateBubbleBottom: {
    top: '100%',
    marginTop: 8,
  },

  /** 气泡速率选项样式 */
  rateBubbleOption: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 6,
  },

  /** 选中状态的气泡速率选项 */
  rateBubbleOptionActive: {
    backgroundColor: 'rgba(79, 142, 247, 0.3)',
  },

  /** 气泡速率选项文字样式 */
  rateBubbleOptionText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#FFFFFF',
  },

  /** 选中状态的气泡速率选项文字 */
  rateBubbleOptionTextActive: {
    color: '#4F8EF7',
    fontWeight: '600',
  },

  /** 气泡小三角 - 基础样式 */
  rateBubbleArrow: {
    position: 'absolute',
    right: 18,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
  },

  /** 箭头朝下时的样式（气泡在按钮上方，全屏模式） */
  rateBubbleArrowDown: {
    bottom: -6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(0, 0, 0, 0.75)',
  },

  /** 箭头朝上时的样式（气泡在按钮下方，非全屏模式） */
  rateBubbleArrowUp: {
    top: -6,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(0, 0, 0, 0.75)',
  },
});
