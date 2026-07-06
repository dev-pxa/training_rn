import React, { useCallback, useEffect, useRef } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, Linking, StatusBar, StyleSheet, View } from 'react-native';
import LoginScreen from '../views/LoginScreen';
import RegisterScreen from '../views/RegisterScreen';
import HomeScreen from '../views/HomeScreen';
import ProfileScreen from '../views/ProfileScreen';
import DeveloperDebugScreen from '../views/DeveloperDebugScreen';
import CourseListScreen from '../views/CourseListScreen';
import CoursePlayerScreen from '../views/CoursePlayerScreen';
import ExamScreen from '../views/ExamScreen';
import ExamResultScreen from '../views/ExamResultScreen';
import CertificateDetailScreen from '../views/CertificateDetailScreen';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types/navigation';
import { DeepLinkTarget, isProtectedDeepLinkTarget, parseDeepLink } from './deepLinks';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { initializing, isAuthenticated } = useAuth();
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const pendingDeepLinkRef = useRef<DeepLinkTarget | null>(null);
  const initialDeepLinkHandledRef = useRef(false);

  /**
   * 执行 deep link 导航。
   *
   * 这里不用动态 navigation.navigate(target.screen, target.params)，是为了保留 RootStackParamList 的类型约束。
   * 每个页面参数都在 switch 里明确传入，后续页面改参数类型时 TypeScript 能及时提醒。
   */
  const navigateToDeepLinkTarget = useCallback((target: DeepLinkTarget) => {
    if (!navigationRef.isReady()) {
      pendingDeepLinkRef.current = target;
      return;
    }

    switch (target.screen) {
      case 'Login':
        navigationRef.navigate('Login');
        break;
      case 'Register':
        navigationRef.navigate('Register');
        break;
      case 'Home':
        navigationRef.navigate('Home');
        break;
      case 'Profile':
        navigationRef.navigate('Profile');
        break;
      case 'CourseList':
        navigationRef.navigate('CourseList', target.params);
        break;
      case 'CoursePlayer':
        navigationRef.navigate('CoursePlayer', target.params);
        break;
      case 'Exam':
        navigationRef.navigate('Exam', target.params);
        break;
      case 'ExamResult':
        navigationRef.navigate('ExamResult', target.params);
        break;
      case 'CertificateDetail':
        navigationRef.navigate('CertificateDetail', target.params);
        break;
    }
  }, [navigationRef]);

  /**
   * 处理外部唤起链接。
   *
   * 未登录时访问业务页，会先缓存目标并留在登录栈；
   * 登录成功后业务栈渲染出来，再由下面的 effect 消费 pendingDeepLinkRef。
   */
  const handleDeepLink = useCallback((url: string) => {
    try {
      const target = parseDeepLink(url);

      if (!target) {
        return;
      }

      if (!isAuthenticated && isProtectedDeepLinkTarget(target)) {
        pendingDeepLinkRef.current = target;
        return;
      }

      navigateToDeepLinkTarget(target);
    } catch (error) {
      console.warn('Deep link 解析失败', error);
    }
  }, [isAuthenticated, navigateToDeepLinkTarget]);

  /**
   * 监听冷启动 initialURL 和运行中收到的 url 事件。
   *
   * initializing 结束后再处理链接，确保本地登录态已经恢复完成；
   * 否则已登录用户冷启动打开业务链接时，可能被误判成未登录。
   */
  useEffect(() => {
    if (initializing) {
      return undefined;
    }

    let isMounted = true;

    Linking.getInitialURL().then((url) => {
      if (isMounted && url && !initialDeepLinkHandledRef.current) {
        initialDeepLinkHandledRef.current = true;
        handleDeepLink(url);
      }
    });

    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, [handleDeepLink, initializing]);

  /**
   * 登录成功后消费未登录期间缓存的业务链接。
   *
   * 这个 effect 只在 isAuthenticated 变为 true 后触发；
   * 因为业务栈此时已经会被渲染出来，目标页面也就可以被正常 navigate。
   */
  useEffect(() => {
    if (!isAuthenticated || !pendingDeepLinkRef.current) {
      return;
    }

    const target = pendingDeepLinkRef.current;
    pendingDeepLinkRef.current = null;

    requestAnimationFrame(() => {
      navigateToDeepLinkTarget(target);
    });
  }, [isAuthenticated, navigateToDeepLinkTarget]);

  /**
   * 初始化阶段不要提前渲染登录页。
   *
   * 因为 AsyncStorage 恢复是异步的，如果这里直接渲染 Login，
   * 已登录用户每次冷启动都会先闪一下登录页，再进入首页，体验和状态都不稳定。
   */
  if (initializing) {
    return (
      <View style={styles.initializingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <ActivityIndicator size="large" color="#4F8EF7" />
      </View>
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        /**
         * 如果冷启动链接早于 NavigationContainer ready，会先进入 pendingDeepLinkRef。
         * 容器 ready 后立刻尝试消费一次；未登录的业务链接会继续留到登录成功后再消费。
         */
        if (pendingDeepLinkRef.current && (isAuthenticated || !isProtectedDeepLinkTarget(pendingDeepLinkRef.current))) {
          const target = pendingDeepLinkRef.current;
          pendingDeepLinkRef.current = null;
          navigateToDeepLinkTarget(target);
        }
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {isAuthenticated ? (
          /**
           * 已登录栈只包含业务页面。
           *
           * 当用户退出或 token 过期时，AuthContext 会把 isAuthenticated 置为 false，
           * React Navigation 会卸载整个业务栈，从根上防止返回键回到受保护页面。
           */
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            {/*
              开发者调试页放在已登录业务栈内：
              1. 入口来自“我的”页面，符合内部调试入口的层级。
              2. 环境切换可能影响当前 token 是否有效，因此保持和业务页同栈，便于保存后继续观察接口表现。
            */}
            <Stack.Screen name="DeveloperDebug" component={DeveloperDebugScreen} />
            <Stack.Screen name="CourseList" component={CourseListScreen} />
            <Stack.Screen name="CoursePlayer" component={CoursePlayerScreen} />
            <Stack.Screen name="Exam" component={ExamScreen} />
            <Stack.Screen name="ExamResult" component={ExamResultScreen} />
            <Stack.Screen name="CertificateDetail" component={CertificateDetailScreen} />
          </>
        ) : (
          /**
           * 未登录栈只包含公开页面。
           *
           * 登录成功后不需要 navigation.replace('Home')，AuthContext 更新状态后这里会自动切到业务栈。
           */
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  initializingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default AppNavigator;
