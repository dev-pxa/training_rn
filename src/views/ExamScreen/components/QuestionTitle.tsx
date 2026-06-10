import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ExamQuestion } from '../../../types/exam';
import styles from '../styles';

interface QuestionTitleProps {
  /** 当前题目；填空题题干使用后端约定的 $ 标记空位。 */
  question: ExamQuestion;
  /** 当前填空题答案；用于让题干中对应编号空位在填写后同步高亮。 */
  fillAnswers?: string[];
  /** 点击题干中的空位编号时，通知答题页滚动并聚焦对应输入框。 */
  onBlankPress?: (blankIndex: number) => void;
}

/** 题干组件：选择题直接展示文本，填空题把 $ 替换成原型中的编号空位标记。 */
const QuestionTitle: React.FC<QuestionTitleProps> = ({ question, fillAnswers = [], onBlankPress }) => {
  if (question.type === 0) {
    return <Text style={styles.questionText}>{question.title}</Text>;
  }

  const parts = question.title.split('$');

  return (
    <View style={styles.questionTextFill}>
      {parts.map((part, index) => (
        <React.Fragment key={`${question.id}-${index}`}>
          {Array.from(part).map((char, charIndex) => (
            <Text key={`${question.id}-${index}-${charIndex}`} style={styles.questionTextFillChar}>
              {char}
            </Text>
          ))}
          {index < parts.length - 1 && index < question.blankCount ? (() => {
            const filled = !!fillAnswers[index]?.trim();

            return (
              <TouchableOpacity
                style={styles.blankMarkerTouchable}
                onPress={() => onBlankPress?.(index)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`第${index + 1}空`}
              >
                {filled ? (
                  <LinearGradient
                    colors={['#4F8EF7', '#7C6EFC']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.blankMarkerContainer, styles.blankMarkerFilledShadow]}
                  >
                    <Text style={styles.blankMarkerFilledText}>{index + 1}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.blankMarkerContainer}>
                    <Text style={styles.blankMarkerText}>{index + 1}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })() : null}
        </React.Fragment>
      ))}
    </View>
  );
};

export default QuestionTitle;
