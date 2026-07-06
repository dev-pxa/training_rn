import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  /** 背景装饰 */
  bgDecoration: {
    position: 'absolute',
    borderRadius: 9999,
  },
  bgCircle1: {
    width: 200,
    height: 200,
    top: -60,
    right: -60,
    backgroundColor: 'rgba(79, 142, 247, 0.05)',
  },
  bgCircle2: {
    width: 140,
    height: 140,
    bottom: -40,
    left: -40,
    backgroundColor: 'rgba(124, 110, 252, 0.04)',
  },
  bgLine: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: 'rgba(79, 142, 247, 0.1)',
    borderRadius: 24,
    transform: [{ rotate: '45deg' }],
    top: '15%',
    left: '10%',
  },
  /** 图标容器 */
  iconWrapper: {
    width: 120,
    height: 120,
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 32,
  },
  /** 文案区域 */
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: -0.24,
  },
  message: {
    fontSize: 15,
    color: '#667085',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  /** 操作按钮 */
  actions: {
    width: '100%',
    gap: 12,
  },
  retryButton: {
    width: '100%',
  },
  retryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#4F8EF7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E7E8EE',
    gap: 8,
  },
  debugButton: {
    // 接口环境不可用时，错误页需要直接暴露调试入口，避免用户必须先回到“我的”页面。
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D6E4FF',
    gap: 8,
  },
  debugButtonText: {
    // 使用主品牌蓝色，和“返回首页”的普通黑色按钮区分，强调这是环境修复入口。
    fontSize: 16,
    fontWeight: '600',
    color: '#4F8EF7',
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});

export default styles;
