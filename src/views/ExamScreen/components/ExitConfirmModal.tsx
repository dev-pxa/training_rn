import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles';

interface ExitConfirmModalProps {
  /** 控制 Modal 展示；由答题页顶部关闭按钮触发。 */
  visible: boolean;
  /** 点击“继续考试”时关闭弹窗，保留当前本地答题状态。 */
  onContinue: () => void;
  /** 点击“确认离开”时返回上一页；当前版本不做答案持久化。 */
  onLeave: () => void;
}

/** 离开确认弹窗：独立出来避免答题页组件继续膨胀。 */
const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({ visible, onContinue, onLeave }) => (
  <Modal transparent visible={visible} animationType="fade">
    <View style={styles.exitOverlay}>
      <View style={styles.exitModal}>
        <View style={styles.exitIconWrap}>
          <View style={styles.exitIconBg} />
          <LinearGradient
            colors={['#4F8EF7', '#7C6EFC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.exitIcon}
          >
            <Text style={styles.exitIconText}>!</Text>
          </LinearGradient>
        </View>
        <Text style={styles.exitTitle}>确认要离开吗？</Text>
        <Text style={styles.exitDesc}>离开后当前答题进度将不会保存，请谨慎操作</Text>
        <View style={styles.exitButtons}>
          <TouchableOpacity style={styles.exitContinueButton} onPress={onContinue}>
            <Text style={styles.exitContinueText}>继续考试</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exitLeaveButton} onPress={onLeave}>
            <Text style={styles.exitLeaveText}>确认离开</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default ExitConfirmModal;
