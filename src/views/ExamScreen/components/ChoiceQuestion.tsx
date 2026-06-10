import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ChoiceExamQuestion } from '../../../types/exam';
import Icon from '../../../components/Icons/Icon';
import styles from '../styles';
import { OPTION_LETTERS } from '../utils';

interface ChoiceQuestionProps {
  /** 当前单选题数据，选项文案完全来自接口。 */
  question: ChoiceExamQuestion;
  /** 当前题已选中的选项下标；undefined 表示未作答。 */
  selectedOption?: number;
  /** 把选项选择事件抛给页面容器，由容器统一维护答案 map。 */
  onSelectOption: (questionId: number, optionIndex: number) => void;
}

/** 单选题组件：只负责选项列表和选中态展示，不关心翻题/提交流程。 */
const ChoiceQuestion: React.FC<ChoiceQuestionProps> = ({ question, selectedOption, onSelectOption }) => (
  <View style={styles.options}>
    {question.options.map((option, index) => {
      const selected = selectedOption === index;

      return (
        <TouchableOpacity
          key={`${question.id}-${option}`}
          style={[styles.option, selected && styles.optionSelected]}
          onPress={() => onSelectOption(question.id, index)}
          activeOpacity={0.8}
        >
          {selected ? (
            <LinearGradient
              colors={['#4F8EF7', '#7C6EFC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.optionLetter}
            >
              <Text style={styles.optionLetterSelectedText}>{OPTION_LETTERS[index]}</Text>
            </LinearGradient>
          ) : (
            <View style={styles.optionLetterIdle}>
              <Text style={styles.optionLetterText}>{OPTION_LETTERS[index]}</Text>
            </View>
          )}
          <Text style={[styles.optionText, selected && styles.optionSelectedText]}>{option}</Text>
          <View style={[styles.optionCheck, selected && styles.optionCheckSelected]}>
            {selected ? <Icon name="CheckCircle" color="#14C9A5" size={24} /> : null}
          </View>
        </TouchableOpacity>
      );
    })}
  </View>
);

export default ChoiceQuestion;
