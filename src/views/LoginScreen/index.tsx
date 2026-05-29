import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { fetchLoginConfig, login } from '../../services/api';
import { saveAuthData } from '../../services/storage';
import { Company, Agreement } from '../../types/login';
import { RootStackParamList } from '../../types/navigation';
import AgreementModal from '../../components/AgreementModal';
import { Icon } from '../../components/Icons';
import styles from './styles';

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

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const config = await fetchLoginConfig();
      // 接口返回格式为 {code, des, data}
      setCompanies(config.data.companies);
      setAgreements(config.data.agreements);
      if (config.data.companies.length > 0) {
        setSelectedCompany(config.data.companies[0]);
      }
    } catch (error) {
      Alert.alert('错误', '获取登录配置失败，请重试');
    } finally {
      setLoading(false);
    }
  };

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

  const openAgreement = () => {
    setShowAgreementModal(true);
  };

  const closeAgreement = () => {
    setShowAgreementModal(false);
  };

  const handleAgree = () => {
    setAgreedToTerms(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F8EF7" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top }]}>
        {/* 品牌展示 */}
        <View style={styles.brandSection}>
          <LinearGradient
            colors={['#4F8EF7', '#7C6EFC']}
            style={styles.logoContainer}
          >
            <Icon name="Logo" color="#FFFFFF" size={64} />
          </LinearGradient>
          <Text style={styles.brandTitle}>企训通</Text>
          <Text style={styles.brandSubtitle}>智能家居行业领先的培训平台</Text>
        </View>

        {/* 表单区域 */}
        <View style={styles.formSection}>
          {/* 企业选择 */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>企业</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setShowCompanyPicker(true)}
            >
              <Text
                style={[
                  styles.inputText,
                  !selectedCompany && styles.placeholderText,
                ]}
              >
                {selectedCompany ? selectedCompany.name : '请选择企业'}
              </Text>
              <View style={styles.chevronContainer}>
                <Icon name="ChevronDown" color="#667085" size={20} />
              </View>
            </TouchableOpacity>
          </View>

          {/* 用户名输入 */}
          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Icon name="User" color="#667085" size={28} />
              </View>
              <TextInput
                style={styles.inputText}
                placeholder="工号 / 手机号"
                placeholderTextColor="#667085"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* 密码输入 */}
          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Icon name="Lock" color="#667085" size={28} />
              </View>
              <TextInput
                style={styles.inputText}
                placeholder="请输入密码"
                placeholderTextColor="#667085"
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
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          >
            <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
              {agreedToTerms && <Icon name="Check" color="#FFFFFF" size={14} />}
            </View>
            <Text style={styles.checkboxLabel}>我已阅读并同意</Text>
            <Text
              style={styles.linkTextInline}
              onPress={openAgreement}
            >
              服务协议
            </Text>
            <Text style={styles.checkboxLabel}>和</Text>
            <Text
              style={styles.linkTextInline}
              onPress={openAgreement}
            >
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
            style={[styles.loginButtonContainer, loggingIn && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loggingIn}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4F8EF7', '#7C6EFC']}
              style={styles.loginButton}
            >
              {loggingIn ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>立即开启学习</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* 注册入口 */}
        <View style={styles.registerSection}>
          <Text style={styles.registerText}>还没有账号？</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>立即注册</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 企业选择器弹窗 */}
      <Modal
        visible={showCompanyPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCompanyPicker(false)}
      >
        <TouchableOpacity
          style={styles.pickerOverlay}
          activeOpacity={1}
          onPress={() => setShowCompanyPicker(false)}
        >
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
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      selectedCompany?.code === item.code &&
                        styles.pickerItemTextSelected,
                    ]}
                  >
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
          agreements={agreements}
          onClose={closeAgreement}
          onAgree={handleAgree}
        />
      )}
    </SafeAreaView>
  );
}

export default LoginScreen;