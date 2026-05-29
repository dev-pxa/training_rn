import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import styles from './styles';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;
type RegisterScreenRouteProp = RouteProp<RootStackParamList, 'Register'>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
  route: RegisterScreenRouteProp;
}

function RegisterScreen({ navigation }: RegisterScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>注册页</Text>
        <Text style={styles.subtitle}>注册功能开发中...</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>返回登录</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default RegisterScreen;