import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import LoginScreen from '../views/LoginScreen';
import RegisterScreen from '../views/RegisterScreen';
import HomeScreen from '../views/HomeScreen';
import ProfileScreen from '../views/ProfileScreen';
import CourseListScreen from '../views/CourseListScreen';
import CoursePlayerScreen from '../views/CoursePlayerScreen';
import ExamScreen from '../views/ExamScreen';
import ExamResultScreen from '../views/ExamResultScreen';
import CertificateDetailScreen from '../views/CertificateDetailScreen';
import { isLoggedIn } from '../services/storage';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Stack.Navigator
        initialRouteName={isLoggedIn() ? 'Home' : 'Login'}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="CourseList" component={CourseListScreen} />
        <Stack.Screen name="CoursePlayer" component={CoursePlayerScreen} />
        <Stack.Screen name="Exam" component={ExamScreen} />
        <Stack.Screen name="ExamResult" component={ExamResultScreen} />
        <Stack.Screen name="CertificateDetail" component={CertificateDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
