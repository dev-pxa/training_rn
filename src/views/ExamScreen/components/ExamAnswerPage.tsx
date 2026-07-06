import React, { useRef, useState } from 'react';
import { ActivityIndicator, LayoutChangeEvent, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ExamDetail, ExamQuestion } from '../../../types/exam';
import Icon from '../../../components/icons/Icon';
import styles from '../styles';
import { formatClock, getQuestionTypeName } from '../utils';
import ChoiceQuestion from './ChoiceQuestion';
import ExitConfirmModal from './ExitConfirmModal';
import FillQuestion from './FillQuestion';
import QuestionTitle from './QuestionTitle';

interface ExamAnswerPageProps {
  /** 接口返回的考试数据，答题页警告文案和题目列表都从这里读取。 */
  data: ExamDetail;
  /** 当前题目对象，由页面容器按 currentQuestionIndex 计算后传入。 */
  currentQuestion: ExamQuestion;
  currentQuestionIndex: number;
  questionCount: number;
  remainingSeconds: number;
  canGoNext: boolean;
  isLastQuestion: boolean;
  submitting: boolean;
  submitError: string | null;
  choiceAnswers: Record<number, number>;
  fillAnswers: Record<number, string[]>;
  onSelectOption: (questionId: number, optionIndex: number) => void;
  onFillAnswerChange: (questionId: number, blankIndex: number, value: string) => void;
  onPrevQuestion: () => void;
  onNextQuestion: () => void;
  onLeave: () => void;
}

/** 答题页壳子：负责答题页布局组合，具体题型渲染交给 ChoiceQuestion / FillQuestion。 */
const ExamAnswerPage: React.FC<ExamAnswerPageProps> = ({
  data,
  currentQuestion,
  currentQuestionIndex,
  questionCount,
  remainingSeconds,
  canGoNext,
  isLastQuestion,
  submitting,
  submitError,
  choiceAnswers,
  fillAnswers,
  onSelectOption,
  onFillAnswerChange,
  onPrevQuestion,
  onNextQuestion,
  onLeave,
}) => {
  const [showExitModal, setShowExitModal] = useState(false);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const fillInputRefs = useRef<Record<number, TextInput | null>>({});
  const fillInputYMap = useRef<Record<number, number>>({});
  const fillSectionY = useRef(0);

  /** 点击题干空位时，滚到对应输入框附近并立刻聚焦，解决输入框不在视口内的问题。 */
  const handleBlankPress = (blankIndex: number) => {
    const targetY = Math.max((fillSectionY.current + (fillInputYMap.current[blankIndex] || 0)) - 24, 0);
    scrollViewRef.current?.scrollTo({ y: targetY, animated: true });
    setTimeout(() => {
      fillInputRefs.current[blankIndex]?.focus();
    }, 120);
  };

  /** 记录每个填空输入区块的位置，供题干空位点击时滚动定位。 */
  const handleBlankLayout = (blankIndex: number, event: LayoutChangeEvent) => {
    fillInputYMap.current[blankIndex] = event.nativeEvent.layout.y;
  };

  return (
    <>
      <View style={styles.answerHeader}>
        <TouchableOpacity style={styles.headerIconButton} onPress={() => setShowExitModal(true)}>
          <Icon name="X" color="#1A1A2E" size={22} />
        </TouchableOpacity>
        <View style={styles.timerPill}>
          <Icon name="Clock" color="#FF5A5A" size={18} />
          <Text style={styles.timerText}>{formatClock(remainingSeconds)}</Text>
        </View>
        <View style={styles.progressPill}>
          <Text style={styles.progressText}>进度 {String(currentQuestionIndex + 1).padStart(2, '0')}/{String(questionCount).padStart(2, '0')}</Text>
        </View>
      </View>

      <View style={styles.warningBanner}>
        <Text style={styles.warningIcon}>!</Text>
        <Text style={styles.warningText}>{data.warningText}</Text>
      </View>

      {submitError ? (
        <View style={styles.submitErrorBanner}>
          <Text style={styles.submitErrorText}>{submitError}</Text>
        </View>
      ) : null}

      <ScrollView ref={scrollViewRef} style={styles.answerContent} showsVerticalScrollIndicator={false}>
        <View style={styles.questionMeta}>
          <LinearGradient
            colors={['#4F8EF7', '#7C6EFC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.questionType}
          >
            <Text style={styles.questionTypeText}>{getQuestionTypeName(currentQuestion)}</Text>
          </LinearGradient>
          <Text style={styles.questionScore}>分值：{currentQuestion.score}分</Text>
        </View>

        <QuestionTitle
          question={currentQuestion}
          fillAnswers={currentQuestion.type === 1 ? fillAnswers[currentQuestion.id] || [] : []}
          onBlankPress={handleBlankPress}
        />
        {currentQuestion.type === 0 ? (
          <ChoiceQuestion
            question={currentQuestion}
            selectedOption={choiceAnswers[currentQuestion.id]}
            onSelectOption={onSelectOption}
          />
        ) : (
          <View
            onLayout={event => {
              fillSectionY.current = event.nativeEvent.layout.y;
            }}
          >
            <FillQuestion
              question={currentQuestion}
              answers={fillAnswers[currentQuestion.id] || []}
              onAnswerChange={onFillAnswerChange}
              inputRefs={fillInputRefs}
              onBlankLayout={handleBlankLayout}
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.secondaryButton, (currentQuestionIndex === 0 || submitting) && styles.disabledButton]}
          onPress={onPrevQuestion}
          disabled={currentQuestionIndex === 0 || submitting}
        >
          <Text style={styles.secondaryButtonText}>上一题</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButtonWrap, (!canGoNext || submitting) && styles.disabledButton]}
          onPress={onNextQuestion}
          disabled={!canGoNext || submitting}
        >
          <LinearGradient
            colors={['#4F8EF7', '#7C6EFC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryButton}
          >
            {submitting ? <ActivityIndicator size="small" color="#FFFFFF" /> : null}
            <Text style={styles.primaryButtonText}>
              {submitting ? '提交中...' : isLastQuestion ? '提交考试' : `确认进入第${currentQuestionIndex + 2}题`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ExitConfirmModal
        visible={showExitModal}
        onContinue={() => setShowExitModal(false)}
        onLeave={onLeave}
      />
    </>
  );
};

export default ExamAnswerPage;
