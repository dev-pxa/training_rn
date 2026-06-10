import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import { ExamDetail } from '../../types/exam';
import { fetchExamDetail } from '../../services/api';
import { useFetchData } from '../../hooks/useFetchData';
import ErrorState from '../../components/ErrorState';
import ExamAnswerPage from './components/ExamAnswerPage';
import ExamStartPage from './components/ExamStartPage';
import styles from './styles';

type ExamScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Exam'>;
type ExamScreenRouteProp = RouteProp<RootStackParamList, 'Exam'>;

interface ExamScreenProps {
  navigation: ExamScreenNavigationProp;
  route: ExamScreenRouteProp;
}

/** 考试页容器：只保留数据请求、考试状态、答案状态和翻题流程，具体 UI 已拆到 components。 */
const ExamScreen: React.FC<ExamScreenProps> = ({ navigation, route }) => {
  const courseId = route.params?.courseId || '';
  const chapterId = route.params?.chapterId || 0;
  const fallbackName = route.params?.name || '认证考试';

  const { data, loading, error, fetchData } = useFetchData<ExamDetail>();
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [choiceAnswers, setChoiceAnswers] = useState<Record<number, number>>({});
  const [fillAnswers, setFillAnswers] = useState<Record<number, string[]>>({});

  /** 页面进入只请求一次考试接口；接口返回开始页文案、考试状态和全部题目。 */
  useEffect(() => {
    fetchData(() => fetchExamDetail(courseId, chapterId));
  }, [chapterId, courseId, fetchData]);

  /** 根据后端返回状态决定展示考前确认页，还是直接续考到指定题目。 */
  useEffect(() => {
    if (!data) return;

    const isInProgress = data.status === 'in_progress';
    const maxQuestionIndex = Math.max(data.questions.length - 1, 0);
    const nextQuestionIndex = Math.min(Math.max(data.currentQuestionIndex, 0), maxQuestionIndex);
    setHasStarted(isInProgress);
    setCurrentQuestionIndex(isInProgress ? nextQuestionIndex : 0);
    setRemainingSeconds(isInProgress ? data.remainingSeconds : data.durationSeconds);
  }, [data]);

  const isAnswering = !!data && (hasStarted || data.status === 'in_progress');

  /** 答题中才启动本地倒计时；倒计时结束后的自动交卷后续可接真实提交接口。 */
  useEffect(() => {
    if (!isAnswering || remainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds(prev => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnswering, remainingSeconds]);

  const questions = data?.questions || [];
  const questionCount = data?.questionCount || questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex >= questions.length - 1;

  /** 下一题按钮校验：选择题必须选中选项，填空题必须每个空都有非空文本。 */
  const canGoNext = useMemo(() => {
    if (!currentQuestion) return false;

    if (currentQuestion.type === 0) {
      return choiceAnswers[currentQuestion.id] !== undefined;
    }

    const answers = fillAnswers[currentQuestion.id] || [];
    return answers.length === currentQuestion.blankCount && answers.every(answer => answer.trim().length > 0);
  }, [choiceAnswers, currentQuestion, fillAnswers]);

  /** 点击“去开始”只切换本地状态，不再请求接口，符合单接口返回全部数据的约束。 */
  const handleStart = () => {
    if (!data) return;

    setHasStarted(true);
    setCurrentQuestionIndex(0);
    setRemainingSeconds(data.durationSeconds);
  };

  /** 选择题答案按 questionId 存储，避免翻题后丢失已选状态。 */
  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setChoiceAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  /** 填空题答案按 questionId + blankIndex 存储，和接口 blankCount 的空位顺序保持一致。 */
  const handleFillAnswerChange = (questionId: number, blankIndex: number, value: string) => {
    setFillAnswers(prev => {
      const current = [...(prev[questionId] || [])];
      current[blankIndex] = value;
      return {
        ...prev,
        [questionId]: current,
      };
    });
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));
  };

  /** 最后一题目前只保留提交占位行为；真实判分/提交接口不在当前需求范围内。 */
  const handleNextQuestion = () => {
    if (!canGoNext) return;

    if (isLastQuestion) {
      console.log('提交考试', { choiceAnswers, fillAnswers });
      navigation.goBack();
      return;
    }

    setCurrentQuestionIndex(prev => Math.min(prev + 1, questions.length - 1));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F8EF7" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ErrorState
          message={error || '考试信息加载失败'}
          onRetry={() => fetchData(() => fetchExamDetail(courseId, chapterId))}
          onGoHome={() => navigation.navigate('Home')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={{ height: 30 }} />
      {isAnswering && currentQuestion ? (
        <ExamAnswerPage
          data={data}
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          questionCount={questionCount}
          remainingSeconds={remainingSeconds}
          canGoNext={canGoNext}
          isLastQuestion={isLastQuestion}
          choiceAnswers={choiceAnswers}
          fillAnswers={fillAnswers}
          onSelectOption={handleSelectOption}
          onFillAnswerChange={handleFillAnswerChange}
          onPrevQuestion={handlePrevQuestion}
          onNextQuestion={handleNextQuestion}
          onLeave={() => navigation.goBack()}
        />
      ) : (
        <ExamStartPage
          data={data}
          fallbackName={fallbackName}
          onCancel={() => navigation.goBack()}
          onStart={handleStart}
        />
      )}
      <View style={styles.homeIndicator}>
        <View style={styles.homeIndicatorBar} />
      </View>
    </SafeAreaView>
  );
};

export default ExamScreen;
