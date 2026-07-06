import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // 页面根容器使用原型里的浅灰背景，让白色卡片和底部固定操作栏更容易分层。
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  // KeyboardAvoidingView 包住整页，避免后续调试表单接入真实输入逻辑后被键盘遮挡。
  keyboardContainer: {
    flex: 1,
  },
  // 顶部导航按原型做成三列：返回按钮、居中标题、右侧占位。
  header: {
    height: 60,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 12,
    backgroundColor: '#F8F9FB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  pageTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  headerPlaceholder: {
    width: 42,
    height: 42,
  },
  // 内容区底部预留固定操作栏高度，避免最后一张卡片被“取消/保存”遮住。
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 124,
  },
  // 顶部说明卡片还原原型的蓝紫渐变和大圆角，只承担说明作用，不承载可操作状态。
  heroCard: {
    marginTop: 4,
    marginBottom: 16,
    padding: 20,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#4F8EF7',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 34,
    elevation: 4,
  },
  heroBubble: {
    // 原型右上角的半透明圆形装饰，用 View 实现，避免额外引入图片资源。
    position: 'absolute',
    width: 130,
    height: 130,
    right: -44,
    top: -48,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  heroKicker: {
    // “Debug / 内部环境”胶囊标签，用于提示这是内部联调页。
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 12,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  heroKickerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  heroTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroCopy: {
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.9)',
  },
  sectionCard: {
    // 接口环境和调试表单都使用同一种白色卡片，和原型保持统一层级。
    padding: 20,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  sectionHead: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 14,
    lineHeight: 21,
    color: '#667085',
  },
  dotList: {
    gap: 10,
  },
  dotOption: {
    // 环境项使用整行可点击区域，比只点击圆点更适合移动端真机调试。
    minHeight: 54,
    borderWidth: 1,
    borderColor: '#E7E8EE',
    borderRadius: 16,
    backgroundColor: '#F8F9FB',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 13,
  },
  dotOptionActive: {
    // 选中态用浅蓝背景和蓝色描边，和原型的 radio active 状态保持一致。
    borderColor: 'rgba(79,142,247,0.42)',
    backgroundColor: '#F3F6FF',
  },
  dot: {
    // 自绘 radio 圆点，避免依赖平台默认控件导致 iOS/Android 样式不一致。
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#667085',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    borderColor: '#4F8EF7',
    backgroundColor: '#4F8EF7',
  },
  dotInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  dotTextGroup: {
    flex: 1,
    minWidth: 0,
  },
  dotTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  dotMeta: {
    fontSize: 12,
    color: '#667085',
  },
  envPill: {
    // 右侧环境标签显示“当前/灰度/线上”，帮助快速识别环境属性。
    flexShrink: 0,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 9999,
    backgroundColor: '#FFFFFF',
  },
  envPillText: {
    color: '#4F8EF7',
    fontSize: 11,
    fontWeight: '800',
  },
  customUrlField: {
    // 只有选中“自定义环境”时展示；保存时只校验是否填写，不校验 URL 格式。
    marginTop: 14,
    gap: 8,
  },
  fieldStack: {
    // 调试表单当前只做 UI 占位，统一间距便于后续接入真实字段保存。
    gap: 14,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  fieldControl: {
    // 输入框样式按原型保留；当前输入值不会写入本地配置，也不会影响接口请求。
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#E7E8EE',
    borderRadius: 16,
    backgroundColor: '#F8F9FB',
    color: '#1A1A1A',
    paddingHorizontal: 13,
    paddingVertical: 12,
    fontSize: 14,
  },
  selectControl: {
    // React Native 原生 Picker 视觉差异较大，先用静态选择框还原设计稿。
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#E7E8EE',
    borderRadius: 16,
    backgroundColor: '#F8F9FB',
    paddingHorizontal: 13,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectText: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  textArea: {
    minHeight: 84,
    lineHeight: 21,
  },
  previewCard: {
    // 额外展示完整请求前缀，帮助确认选中的域名和固定 /api/app 前缀是否符合预期。
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E8EE',
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#667085',
    marginBottom: 6,
  },
  previewValue: {
    fontSize: 13,
    lineHeight: 19,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  toast: {
    // 保存反馈沿用原型的底部悬浮 Toast，不打断调试人员的当前操作流。
    position: 'absolute',
    alignSelf: 'center',
    bottom: 104,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 9999,
    backgroundColor: 'rgba(26,26,26,0.9)',
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  fixedActions: {
    // 底部操作区固定在屏幕底部，保存环境时不需要滚动到页面末尾。
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#E7E8EE',
    backgroundColor: 'rgba(248,249,251,0.96)',
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCancel: {
    // 取消按钮保持白底描边，表达“离开且不保存临时选择”。
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E8EE',
  },
  actionSave: {
    // 保存按钮使用主色，表示这是唯一会写入环境配置的动作。
    backgroundColor: '#4F8EF7',
    shadowColor: '#4F8EF7',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.24,
    shadowRadius: 24,
    elevation: 3,
  },
  actionCancelText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4B5563',
  },
  actionSaveText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export default styles;
