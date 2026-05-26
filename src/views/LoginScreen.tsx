import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { fetchLoginConfig, login } from '../services/api';
import { saveAuthData } from '../services/storage';
import { Company, Agreement } from '../types/login';
import { RootStackParamList } from '../types/navigation';
import AgreementModal from '../components/AgreementModal';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
}

function LoginScreen({ navigation }: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [agreements, setAgreements] = useState<Agreement | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCompanyPicker, setShowCompanyPicker] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);

  // 获取登录页配置
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const config = await fetchLoginConfig();
      setCompanies(config.companies);
      setAgreements(config.agreements);
      if (config.companies.length > 0) {
        setSelectedCompany(config.companies[0]);
      }
    } catch (error) {
      Alert.alert('错误', '获取登录配置失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理登录
  const handleLogin = async () => {
    if (!selectedCompany) {
      Alert.alert('提示', '请选择企业');
      return;
    }
    if (!username.trim()) {
      Alert.alert('提示', '请输入工号/手机号');
      return;
    }
    if (!password.trim()) {
      Alert.alert('提示', '请输入密码');
      return;
    }
    if (!agreedToTerms) {
      // 未勾选同意，弹出协议弹窗
      setShowAgreementModal(true);
      return;
    }

    setLoggingIn(true);
    try {
      const response = await login({
        companyCode: selectedCompany.code,
        username: username.trim(),
        password: password.trim(),
      });
      saveAuthData(response);
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('登录失败', '请检查用户名和密码');
    } finally {
      setLoggingIn(false);
    }
  };

  // 打开协议弹窗
  const openAgreement = () => {
    setShowAgreementModal(true);
  };

  // 关闭协议弹窗
  const closeAgreement = () => {
    setShowAgreementModal(false);
  };

  // 同意协议
  const handleAgree = () => {
    setAgreedToTerms(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { paddingTop: 40 + insets.top }]}>
        {/* 企业品牌展示 */}
        <View style={styles.brandSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🎓</Text>
          </View>
          <Text style={styles.brandTitle}>企训通</Text>
          <Text style={styles.brandSubtitle}>智能家居行业领先的培训平台</Text>
        </View>

        {/* 表单区域 */}
        <View style={styles.formSection}>
          {/* 企业验证代码 - 下拉选择 */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>企业</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setShowCompanyPicker(true)}>
              <Text style={styles.inputIcon}>🏢</Text>
              <Text
                style={[
                  styles.input,
                  !selectedCompany && styles.placeholderText,
                ]}>
                {selectedCompany ? selectedCompany.name : '请选择企业'}
              </Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* 登录输入框 */}
          <View style={styles.loginInputs}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="工号 / 手机号"
                placeholderTextColor="#9ca3af"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>🔐</Text>
              <TextInput
                style={styles.input}
                placeholder="请输入密码"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>
        </View>

        {/* 快捷操作 */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreedToTerms(!agreedToTerms)}>
            <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
              {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>我已阅读并同意</Text>
            <Text
              style={styles.linkTextInline}
              onPress={openAgreement}>
              服务协议
            </Text>
            <Text style={styles.checkboxLabel}>和</Text>
            <Text
              style={styles.linkTextInline}
              onPress={openAgreement}>
              隐私条款
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>忘记密码？</Text>
          </TouchableOpacity>
        </View>

        {/* 提交按钮 */}
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[styles.loginButton, loggingIn && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loggingIn}
            activeOpacity={0.8}>
            {loggingIn ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.loginButtonText}>立即开启学习</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 注册入口 */}
        <View style={styles.registerSection}>
          <Text style={styles.registerText}>还没有账号？</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>立即注册</Text>
          </TouchableOpacity>
        </View>

        {/* 底部版权 */}
        <View style={styles.footer}>
          <Text style={styles.copyrightText}>© 2026 SmartHome Training Lab</Text>
        </View>
      </View>

      {/* 企业选择下拉弹窗 */}
      <Modal
        visible={showCompanyPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCompanyPicker(false)}>
        <TouchableOpacity
          style={styles.pickerOverlay}
          activeOpacity={1}
          onPress={() => setShowCompanyPicker(false)}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>选择企业</Text>
              <TouchableOpacity onPress={() => setShowCompanyPicker(false)}>
                <Text style={styles.pickerClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={companies}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.pickerItem,
                    selectedCompany?.code === item.code && styles.pickerItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedCompany(item);
                    setShowCompanyPicker(false);
                  }}>
                  <Text
                    style={[
                      styles.pickerItemText,
                      selectedCompany?.code === item.code &&
                        styles.pickerItemTextSelected,
                    ]}>
                    {item.name}
                  </Text>
                  <Text style={styles.pickerItemCode}>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 协议弹窗 */}
      {agreements && (
        <AgreementModal
          visible={showAgreementModal}
          sections={[
            {
              title: agreements.serviceAgreement.title,
              content: agreements.serviceAgreement.content,
            },
            {
              title: agreements.privacyPolicy.title,
              content: agreements.privacyPolicy.content,
            },
          ]}
          onClose={closeAgreement}
          onAgree={handleAgree}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
  },
  brandSection: {
    marginTop: 40,
    marginBottom: 48,
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#2563eb',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#bfdbfe',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 36,
    color: '#ffffff',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1f2937',
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
  formSection: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
    marginLeft: 4,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 8,
    color: '#9ca3af',
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 14,
    color: '#000000',
  },
  placeholderText: {
    color: '#9ca3af',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#9ca3af',
  },
  loginInputs: {
    gap: 16,
    paddingTop: 16,
  },
  quickActions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 16,
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
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  forgotPassword: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  submitSection: {
    width: '100%',
    marginTop: 40,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#bfdbfe',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  registerText: {
    fontSize: 12,
    color: '#6b7280',
  },
  registerLink: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
    marginLeft: 4,
  },
  footer: {
    paddingBottom: 32,
    alignItems: 'center',
  },
  agreementText: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
  },
  linkText: {
    color: '#3b82f6',
    textDecorationLine: 'underline',
  },
  linkTextInline: {
    fontSize: 12,
    color: '#3b82f6',
    textDecorationLine: 'underline',
  },
  copyrightText: {
    fontSize: 10,
    color: '#d1d5db',
  },
  // 企业选择器样式
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '50%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  pickerClose: {
    fontSize: 20,
    color: '#6b7280',
  },
  pickerItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  pickerItemSelected: {
    backgroundColor: '#eff6ff',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 4,
  },
  pickerItemTextSelected: {
    color: '#2563eb',
    fontWeight: '500',
  },
  pickerItemCode: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default LoginScreen;
