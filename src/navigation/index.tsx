import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import LoginScreen from '../views/LoginScreen';
import RegisterScreen from '../views/RegisterScreen';
import HomeScreen from '../views/HomeScreen';
import ProfileScreen from '../views/ProfileScreen';
import CourseListScreen from '../views/CourseListScreen';
import CoursePlayerScreen from '../views/CoursePlayerScreen';
import ExamScreen from '../views/ExamScreen';
import ExamResultScreen from '../views/ExamResultScreen';
import CertificateDetailScreen from '../views/CertificateDetailScreen';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { initializing, isAuthenticated } = useAuth();

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
    <NavigationContainer>
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
