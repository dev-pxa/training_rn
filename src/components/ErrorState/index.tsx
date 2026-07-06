import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '../icons/Icon';
import styles from './styles';

interface ErrorStateProps {
  /** 错误标题，默认"加载失败" */
  title?: string;
  /** 错误描述，默认"网络连接出现问题，请检查后重试" */
  message?: string;
  /** 重试按钮点击回调 */
  onRetry?: () => void;
  /**
   * 进入开发者调试页的回调。
   *
   * 当用户在开发者调试页切到了不可用环境后，各业务页会进入全屏错误态。
   * 这里提供一个统一入口，让用户无需返回“我的”页面，就能直接切换接口环境。
   */
  onOpenDebug?: () => void;
  /** 返回首页按钮点击回调，如果不传则不显示该按钮 */
  onGoHome?: () => void;
  /** 是否显示重试按钮，默认 true */
  showRetry?: boolean;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = '加载失败',
  message = '网络连接出现问题，请检查后重试',
  onRetry,
  onOpenDebug,
  onGoHome,
  showRetry = true,
}) => {
  return (
    <View style={styles.container}>
      {/* 背景装饰 */}
      <View style={[styles.bgDecoration, styles.bgCircle1]} />
      <View style={[styles.bgDecoration, styles.bgCircle2]} />
      <View style={styles.bgLine} />

      {/* 图标容器 */}
      <View style={styles.iconWrapper}>
        <LinearGradient
          colors={['#4F8EF7', '#7C6EFC']}
          style={styles.iconCircle}
        >
          <Text style={styles.iconText}>!</Text>
        </LinearGradient>
      </View>

      {/* 文案区域 */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      {/* 操作按钮 */}
      <View style={styles.actions}>
        {showRetry && onRetry && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={onRetry}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4F8EF7', '#7C6EFC']}
              style={styles.retryButtonGradient}
            >
              <Icon name="Refresh" size={18} color="#FFFFFF" />
              <Text style={styles.retryButtonText}>重试</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        {onOpenDebug && (
          <TouchableOpacity
            style={styles.debugButton}
            onPress={onOpenDebug}
            activeOpacity={0.7}
          >
            <Icon name="Settings" size={18} color="#4F8EF7" />
            <Text style={styles.debugButtonText}>开发者调试</Text>
          </TouchableOpacity>
        )}
        {onGoHome && (
          <TouchableOpacity
            style={styles.homeButton}
            onPress={onGoHome}
            activeOpacity={0.7}
          >
            <Icon name="Home" size={18} color="#1A1A1A" />
            <Text style={styles.homeButtonText}>返回首页</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ErrorState;
