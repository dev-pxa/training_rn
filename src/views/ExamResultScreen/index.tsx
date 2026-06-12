import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ErrorState from '../../components/ErrorState';
import Icon from '../../components/Icons/Icon';
import { fetchExamResult } from '../../services/api';
import { useFetchData } from '../../hooks/useFetchData';
import { CourseCategory } from '../../types/courseList';
import { RootStackParamList } from '../../types/navigation';
import { ExamResult } from '../../types/exam';
import styles from './styles';

type ExamResultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ExamResult'>;
type ExamResultScreenRouteProp = RouteProp<RootStackParamList, 'ExamResult'>;

interface ExamResultScreenProps {
  navigation: ExamResultScreenNavigationProp;
  route: ExamResultScreenRouteProp;
}

const ExamResultScreen: React.FC<ExamResultScreenProps> = ({ navigation, route }) => {
  const { examRecordId, courseId, chapterId } = route.params;
  const { data, loading, error, fetchData } = useFetchData<ExamResult>();
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    fetchData(() => fetchExamResult(Number(examRecordId)));
  }, [examRecordId, fetchData]);

  useEffect(() => {
    if (!toastVisible) return;

    const timer = setTimeout(() => {
      setToastVisible(false);
    }, 1600);

    return () => clearTimeout(timer);
  }, [toastVisible]);

  const heroColors = data?.passed ? ['#4F8EF7', '#7C6EFC'] : ['#FF8A4C', '#FF5A7A'];
  const shadowColor = data?.passed ? '#4F8EF7' : '#FF5A5A';

  const summaryItems = useMemo(() => {
    return data?.dataOverview ?? [];
  }, [data?.dataOverview]);

  const handleShare = () => {
    setToastVisible(true);
  };

  const handleRetryExam = () => {
    if (chapterId === undefined) return;

    navigation.replace('Exam', {
      courseId,
      chapterId,
    });
  };

  const handleViewWrongQuestions = () => {
    Alert.alert('提示', '敬请期待。。。');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F8EF7" />
          <Text style={styles.loadingText}>加载成绩中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ErrorState
          message={error || '考试结果加载失败'}
          onRetry={() => fetchData(() => fetchExamResult(Number(examRecordId)))}
          onGoHome={() => navigation.navigate('Home')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={{ height: 30 }} />   
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconButton} onPress={() => navigation.navigate('Home')}>
          <Icon name="X" color="#1A1A2E" size={22} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>考试成绩</Text>
        <TouchableOpacity style={styles.headerIconButton} onPress={handleShare}>
          <Icon name="Share" color="#1A1A2E" size={20} />
        </TouchableOpacity>
      </View>

      {toastVisible ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>成绩卡已生成</Text>
        </View>
      ) : null}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={heroColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.resultHero, { shadowColor }]}
        >
          <View style={styles.heroHalo} />
          <View style={styles.resultStatus}>
            <Icon name={data.passed ? 'VerifiedCheck' : 'X'} color="#FFFFFF" size={16} />
            <Text style={styles.resultStatusText}>{data.resultStatusText}</Text>
          </View>
          <View style={styles.scoreRow}>
            <Text style={styles.score}>{data.score}</Text>
            <Text style={styles.scoreUnit}>分</Text>
          </View>
          <Text style={styles.resultTitle}>{data.examName}</Text>
          <Text style={styles.resultDesc}>{data.resultDesc}</Text>
          {data.passed ? (
            <TouchableOpacity style={styles.heroAction} onPress={() => navigation.navigate('Profile')}>
              <Icon name="Medal" color="#FFFFFF" size={18} />
              <Text style={styles.heroActionText}>查看证书</Text>
            </TouchableOpacity>
          ) : null}
        </LinearGradient>

        <View style={styles.summaryGrid}>
          {summaryItems.map(item => (
            <View key={item.name} style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{item.value}</Text>
              <Text style={styles.summaryLabel}>{item.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>题型表现</Text>
            <TouchableOpacity onPress={handleViewWrongQuestions} activeOpacity={0.8}>
              <Text style={styles.sectionLink}>查看错题</Text>
            </TouchableOpacity>
          </View>
          {data.typePerformance.map(item => {
            const percent = item.totalCount > 0 ? Math.round((item.correctCount / item.totalCount) * 100) : 0;
            return (
              <View key={item.name} style={styles.typeRow}>
                <Text style={styles.typeName}>{item.name}</Text>
                <View style={styles.bar}>
                  <LinearGradient
                    colors={heroColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.barFill, { width: `${percent}%` }]}
                  />
                </View>
                <Text style={styles.typeScore}>{item.correctCount}/{item.totalCount}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.certificateCard}>
          <Image source={{ uri: data.tipInfo.img }} style={styles.certificateIcon} />
          <View style={styles.certificateCopy}>
            <Text style={styles.certificateTitle}>{data.tipInfo.title}</Text>
            <Text style={styles.certificateDesc}>{data.tipInfo.desc}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            if (data.passed) {
              navigation.navigate('Home');
            } else {
              navigation.navigate('CourseList', { category: 'required' as CourseCategory });
            }
          }}
        >
          <Text style={styles.secondaryButtonText}>{data.passed ? '返回首页' : '去学习'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButtonWrap} onPress={handleRetryExam}>
          <LinearGradient
            colors={['#4F8EF7', '#7C6EFC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryButton}
          >
            <Icon name="Refresh" color="#FFFFFF" size={18} />
            <Text style={styles.primaryButtonText}>{data.passed ? '再练一次' : '重新考试'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.homeIndicator}>
        <View style={styles.homeIndicatorBar} />
      </View>
    </SafeAreaView>
  );
};

export default ExamResultScreen;
