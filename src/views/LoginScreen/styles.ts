import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  contentInner: {
    // 表单内容不足一屏时自然占满屏幕；键盘弹起后由外层 ScrollView 负责滚动露出输入框。
    flex: 1,
  },
  brandSection: {
    marginTop: 32,
    marginBottom: 32,
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#4F8EF7',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 16,
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.36,
  },
  brandSubtitle: {
    fontSize: 18,
    color: '#667085',
    marginTop: 8,
  },
  formSection: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginLeft: 4,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: '#E7E8EE',
  },
  inputIconContainer: {
    marginRight: 12,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputText: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 16,
    color: '#1A1A1A',
  },
  placeholderText: {
    color: '#667085',
  },
  chevronContainer: {
    position: 'absolute',
    right: 20,
  },
  quickActions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E7E8EE',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4F8EF7',
    borderColor: '#4F8EF7',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#4B5563',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#4F8EF7',
    fontWeight: '500',
  },
  submitSection: {
    width: '100%',
    marginTop: 32,
  },
  loginButtonContainer: {
    borderRadius: 20,
    shadowColor: '#4F8EF7',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 32,
    elevation: 12,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.18,
  },
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  registerText: {
    fontSize: 14,
    color: '#667085',
  },
  registerLink: {
    fontSize: 16,
    color: '#4F8EF7',
    fontWeight: '600',
    marginLeft: 4,
  },
  linkTextInline: {
    fontSize: 14,
    color: '#4F8EF7',
    fontWeight: '500',
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '50%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E8EE',
  },
  pickerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  pickerClose: {
    fontSize: 20,
    color: '#4B5563',
  },
  pickerItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pickerItemSelected: {
    backgroundColor: 'rgba(79, 142, 247, 0.08)',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  pickerItemTextSelected: {
    color: '#4F8EF7',
    fontWeight: '500',
  },
  pickerItemCode: {
    fontSize: 14,
    color: '#667085',
  },
});

export default styles;
