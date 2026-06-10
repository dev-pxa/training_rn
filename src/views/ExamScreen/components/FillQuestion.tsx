import React, { useState } from 'react';
import { LayoutChangeEvent, Text, TextInput, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { FillExamQuestion } from '../../../types/exam';
import Icon from '../../../components/Icons/Icon';
import styles from '../styles';

interface FillQuestionProps {
  /** 当前填空题数据；blankCount 决定输入框数量。 */
  question: FillExamQuestion;
  /** 当前题每个空的答案数组，下标与空位编号一一对应。 */
  answers: string[];
  /** 把输入变化抛给页面容器，避免子组件保存临时状态导致翻题丢失。 */
  onAnswerChange: (questionId: number, blankIndex: number, value: string) => void;
  /** 每个输入框的 ref，由答题页统一保存，供题干空位点击时精准 focus。 */
  inputRefs: React.MutableRefObject<Record<number, TextInput | null>>;
  /** 回传每个输入框在 ScrollView 内容中的相对位置，用于点击空位时滚动定位。 */
  onBlankLayout: (blankIndex: number, event: LayoutChangeEvent) => void;
}

/** 填空题组件：根据接口 blankCount 渲染输入框，并展示“已填写”提示。 */
const FillQuestion: React.FC<FillQuestionProps> = ({
  question,
  answers,
  onAnswerChange,
  inputRefs,
  onBlankLayout,
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  return (
    <View style={styles.fillAnswerArea}>
      <View style={styles.fillAnswerTitleRow}>
        <Icon name="Book" color="#4F8EF7" size={16} />
        <Text style={styles.fillAnswerTitle}>请填写以下空格答案</Text>
      </View>
      {Array.from({ length: question.blankCount }).map((_, index) => {
        const value = answers[index] || '';
        const filled = value.trim().length > 0;
        const focused = focusedIndex === index;

        return (
          <View
            key={`${question.id}-blank-${index}`}
            style={[styles.fillBlankItem, index === question.blankCount - 1 && styles.fillBlankItemLast]}
            onLayout={event => onBlankLayout(index, event)}
          >
            <View style={styles.fillBlankLabelRow}>
              <LinearGradient
                colors={['#4F8EF7', '#7C6EFC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.fillBlankIndex}
              >
                <Text style={styles.fillBlankIndexText}>{index + 1}</Text>
              </LinearGradient>
              <Text style={styles.fillBlankLabel}>第 {index + 1} 空</Text>
            </View>
            <View style={[styles.fillInputWrapper, focused && styles.fillInputWrapperFocused]}>
              <TextInput
                ref={ref => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.fillInput,
                  filled && styles.fillInputFilled,
                  focused && styles.fillInputFocused,
                ]}
                value={value}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(current => (current === index ? null : current))}
                onChangeText={text => onAnswerChange(question.id, index, text)}
                placeholder="请输入答案"
                placeholderTextColor="#8A8A9A"
              />
              {filled ? (
                <View style={styles.fillHint}>
                  <Icon name="CheckCircle" color="#14C9A5" size={14} />
                  <Text style={styles.fillHintText}>已填写</Text>
                </View>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default FillQuestion;
