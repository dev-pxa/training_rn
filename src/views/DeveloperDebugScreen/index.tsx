import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { Icon } from '../../components/icons';
import {
  API_ENVIRONMENT_OPTIONS,
  ApiEnvironment,
  getDefaultEnvironmentConfig,
  loadEnvironmentConfig,
  saveEnvironmentConfig,
} from '../../services/environment';
import styles from './styles';

type DeveloperDebugScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DeveloperDebug'>;

interface DeveloperDebugScreenProps {
  navigation: DeveloperDebugScreenNavigationProp;
}

const ENVIRONMENT_ORDER: ApiEnvironment[] = ['test', 'mock', 'production', 'custom'];

const DeveloperDebugScreen: React.FC<DeveloperDebugScreenProps> = ({ navigation }) => {
  /**
   * 页面首次渲染先使用默认线上环境，随后再异步读取本地保存的环境。
   * 这样即使 AsyncStorage 读取较慢，界面也能先稳定展示，不会出现空白态。
   */
  const [selectedEnv, setSelectedEnv] = useState<ApiEnvironment>(getDefaultEnvironmentConfig().env);
  const [customApiBaseUrl, setCustomApiBaseUrl] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isMounted = true;

    /**
     * 进入页面时恢复上一次保存的接口环境。
     * loadEnvironmentConfig 内部已经处理了“无配置/读取失败/配置损坏”的线上兜底。
     */
    loadEnvironmentConfig().then((config) => {
      if (isMounted) {
        setSelectedEnv(config.env);
        if (config.env === 'custom') {
          setCustomApiBaseUrl(config.apiBaseUrl);
        }
      }
    });

    return () => {
      isMounted = false;
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (message: string) => {
    /**
     * 保存成功使用轻量 Toast 反馈，和原型保持一致。
     * 每次展示前清理旧 timer，避免连续点击保存时旧 timer 提前把新 Toast 隐藏。
     */
    setToastMessage(message);

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setToastMessage('');
    }, 1600);
  };

  const handleSave = async () => {
    try {
      if (selectedEnv === 'custom' && !customApiBaseUrl.trim()) {
        Alert.alert('提示', '请输入自定义环境域名');
        return;
      }

      /**
       * 当前保存逻辑只处理接口环境。
       * 原型中的调试范围、接口路径、测试用户 ID、调试备注暂时不写入存储，也不会影响任何请求。
       */
      const config = await saveEnvironmentConfig(selectedEnv, customApiBaseUrl);
      const label = API_ENVIRONMENT_OPTIONS[config.env].label;
      showToast(`${label}配置已保存`);

      /**
       * 环境切换后旧 token 可能只在原环境有效。
       * 这里先不强制退出登录，只提示用户遇到登录过期时重新登录，保留联调时的操作弹性。
       */
      Alert.alert('接口环境已切换', '当前登录态可能不适用于新环境，如接口返回登录过期，请重新登录。', [
        { text: '知道了', style: 'default' },
      ]);
    } catch {
      Alert.alert('保存失败', '调试配置保存失败，请稍后重试。');
    }
  };

  // 用于底部“当前请求前缀”预览，帮助调试人员确认保存前将要切到哪个 API 地址。
  const selectedOption = API_ENVIRONMENT_OPTIONS[selectedEnv];
  const previewApiBaseUrl = selectedEnv === 'custom' ? customApiBaseUrl.trim() : selectedOption.apiBaseUrl;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          {/* 顶部导航结构对齐原型：左侧返回、中间标题、右侧占位保持标题居中。 */}
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.75}
            onPress={() => navigation.goBack()}
            accessibilityLabel="返回我的页面"
          >
            <Icon name="Back" size={22} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>开发者调试</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 说明卡片按原型保留，只做页面用途提示，不参与环境切换逻辑。 */}
          <LinearGradient
            colors={['#4F8EF7', '#7C6EFC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroBubble} />
            <View style={styles.heroKicker}>
              <Text style={styles.heroKickerText}>Debug</Text>
              <Text style={styles.heroKickerText}>内部环境</Text>
            </View>
            <Text style={styles.heroTitle}>切换调试配置前，请确认当前账号和接口环境。</Text>
            <Text style={styles.heroCopy}>此页面用于培训 App 内部联调，保存后仅影响当前设备的调试参数。</Text>
          </LinearGradient>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>接口环境</Text>
              <Text style={styles.sectionDesc}>一行一个点按钮，选择后用于接口请求和日志上报。</Text>
            </View>

            <View style={styles.dotList}>
              {/*
                只有这里的单选结果会在点击保存后真正写入 AsyncStorage。
                请求层会在下一次 fetch 前读取这个配置，从而切换接口域名。
              */}
              {ENVIRONMENT_ORDER.map((env) => {
                const option = API_ENVIRONMENT_OPTIONS[env];
                const isActive = selectedEnv === env;

                return (
                  <Pressable
                    key={env}
                    style={[styles.dotOption, isActive && styles.dotOptionActive]}
                    onPress={() => setSelectedEnv(env)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isActive }}
                  >
                    <View style={[styles.dot, isActive && styles.dotActive]}>
                      {isActive && <View style={styles.dotInner} />}
                    </View>
                    <View style={styles.dotTextGroup}>
                      <Text style={styles.dotTitle}>{option.label}</Text>
                      <Text style={styles.dotMeta} numberOfLines={1}>
                        {(env === 'custom' ? customApiBaseUrl.trim() || '请输入自定义域名' : option.apiBaseUrl.replace(/^https?:\/\//, ''))}
                      </Text>
                    </View>
                    <View style={styles.envPill}>
                      <Text style={styles.envPillText}>{isActive ? '当前' : option.badge}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {selectedEnv === 'custom' && (
              <View style={styles.customUrlField}>
                <Text style={styles.fieldLabel}>自定义域名</Text>
                <TextInput
                  style={styles.fieldControl}
                  value={customApiBaseUrl}
                  onChangeText={setCustomApiBaseUrl}
                  placeholder="请输入自定义环境域名"
                  placeholderTextColor="#98A2B3"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            )}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>调试表单</Text>
              <Text style={styles.sectionDesc}>配置联调范围和临时参数，保存后下次打开仍按当前设置展示。</Text>
            </View>

            {/*
              调试表单目前只还原设计稿 UI。
              这些输入值不会保存，也不会参与接口请求，避免在需求未确认前引入隐藏行为。
            */}
            <View style={styles.fieldStack}>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>调试范围</Text>
                <View style={styles.selectControl}>
                  <Text style={styles.selectText}>考试流程</Text>
                  <Icon name="ChevronDown" size={16} color="#667085" />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>接口路径</Text>
                <TextInput
                  style={styles.fieldControl}
                  defaultValue="/training/exam/submit"
                  placeholder="请输入接口路径"
                  placeholderTextColor="#98A2B3"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>测试用户 ID</Text>
                <TextInput
                  style={styles.fieldControl}
                  defaultValue="u_20260528_zhang"
                  placeholder="请输入用户 ID"
                  placeholderTextColor="#98A2B3"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>调试备注</Text>
                <TextInput
                  style={[styles.fieldControl, styles.textArea]}
                  defaultValue="验证考试提交、结果页、证书跳转链路。"
                  placeholder="记录本次联调目标"
                  placeholderTextColor="#98A2B3"
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          <View style={styles.previewCard}>
            {/* 预览值即时跟随选中环境变化，但只有点击保存后才会成为真实请求环境。 */}
            <Text style={styles.previewLabel}>当前请求前缀</Text>
            <Text style={styles.previewValue} numberOfLines={2}>
              {previewApiBaseUrl ? `${previewApiBaseUrl}/api/app` : '请输入自定义环境域名'}
            </Text>
          </View>
        </ScrollView>

        {!!toastMessage && (
          // Toast 只用于保存反馈，消失后不影响页面状态。
          <View style={styles.toast}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}

        <View style={styles.fixedActions}>
          {/* 取消只返回上一页，不保存当前临时选择。 */}
          <TouchableOpacity
            style={[styles.actionButton, styles.actionCancel]}
            activeOpacity={0.75}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.actionCancelText}>取消</Text>
          </TouchableOpacity>
          {/* 保存只提交接口环境；调试表单字段暂不提交。 */}
          <TouchableOpacity
            style={[styles.actionButton, styles.actionSave]}
            activeOpacity={0.82}
            onPress={handleSave}
          >
            <Text style={styles.actionSaveText}>保存</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DeveloperDebugScreen;
