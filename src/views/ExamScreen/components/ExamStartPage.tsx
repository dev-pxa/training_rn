import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ExamDetail } from '../../../types/exam';
import Icon from '../../../components/icons/Icon';
import styles from '../styles';
import { getSummaryIconName } from '../utils';

interface ExamStartPageProps {
  /** 接口返回的完整考试数据；考前页除顶部导航和底部按钮外的文案都从这里读取。 */
  data: ExamDetail;
  /** 课程目录传入的章节名，仅当接口 name 为空时兜底展示。 */
  fallbackName: string;
  /** 顶部返回按钮和底部取消按钮共享同一个返回行为。 */
  onCancel: () => void;
  /** 点击“去开始”只切本地状态，不再二次请求接口。 */
  onStart: () => void;
}

/** 考前确认页：还原原型首屏，同时把业务文案收口到接口字段 startPage。 */
const ExamStartPage: React.FC<ExamStartPageProps> = ({ data, fallbackName, onCancel, onStart }) => {
  const { startPage } = data;

  return (
    <>
      <View style={styles.startHeader}>
        <TouchableOpacity style={styles.headerIconButton} onPress={onCancel}>
          <Icon name="Back" color="#1A1A2E" size={22} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>考前确认</Text>
        <View />
        {/* <View style={styles.headerIconButton}>
          <Text style={styles.helpText}>?</Text>
        </View> */}
      </View>

      <ScrollView style={styles.startContent} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#4F8EF7', '#7C6EFC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.examHero}
        >
          <View style={styles.heroHalo} />
          <Text style={styles.examStatus}>{startPage.statusText}</Text>
          <Text style={styles.examName}>{data.name || fallbackName}</Text>
          <Text style={styles.examDesc}>{data.desc}</Text>
        </LinearGradient>

        <View style={styles.summaryGrid}>
          {startPage.summaryItems.map(item => (
            <View key={item.type} style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Icon name={getSummaryIconName(item)} color="#4F8EF7" size={18} />
              </View>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={styles.summaryValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Icon name="CheckCircle" color="#4F8EF7" size={18} />
            <Text style={styles.sectionTitle}>{startPage.requirementTitle}</Text>
          </View>
          {startPage.requirements.map((item, index) => (
            <View key={item} style={styles.requirementItem}>
              <Text style={styles.requirementIndex}>{index + 1}</Text>
              <Text style={styles.requirementText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.noticeCard}>
          <Text style={styles.noticeIcon}>!</Text>
          <Text style={styles.noticeCopy}>{startPage.notice}</Text>
        </View>

        <View style={styles.confirmRow}>
          <LinearGradient
            colors={['#4F8EF7', '#7C6EFC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.confirmDot}
          >
            <Icon name="Check" color="#FFFFFF" size={12} />
          </LinearGradient>
          <Text style={styles.confirmText}>{startPage.confirmText}</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.secondaryButton} onPress={onCancel}>
          <Text style={styles.secondaryButtonText}>取消</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButtonWrap} onPress={onStart}>
          <LinearGradient
            colors={['#4F8EF7', '#7C6EFC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>去开始</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ExamStartPage;
