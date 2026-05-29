import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from '../Icons';
import { Agreement } from '../../types/login';
import styles from './styles';

interface AgreementModalProps {
  visible: boolean;
  agreements: Agreement;
  onClose: () => void;
  onAgree?: () => void;
}

function AgreementModal({ visible, agreements, onClose, onAgree }: AgreementModalProps) {
  const [activeTab, setActiveTab] = useState(0);

  const handleAgree = () => {
    onAgree?.();
    onClose();
  };

  const tabTitles = [
    agreements.serviceAgreement.title,
    agreements.privacyPolicy.title,
  ];

  const renderContent = (contents: Array<{ title: string; content: string }>) => (
    <View style={styles.section}>
      {contents.map((item, index) => (
        <View key={index}>
          <Text style={styles.sectionTitle}>{item.title}</Text>
          {item.content.split('\n').map((line, lineIndex) => (
            <Text key={lineIndex} style={styles.contentText}>
              {line}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* 头部 */}
          <View style={styles.header}>
            <Text style={styles.title}>服务协议与隐私政策</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="X" color="#4B5563" size={20} />
            </TouchableOpacity>
          </View>

          {/* 标签切换 */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab]}
              onPress={() => setActiveTab(0)}
            >
              {activeTab === 0 ? (
                <LinearGradient
                  colors={['#4F8EF7', '#7C6EFC']}
                  style={styles.tabActive}
                >
                  <Text style={styles.tabTextActive}>
                    {tabTitles[0]}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.tabInactive}>
                  <Text style={styles.tabText}>
                    {tabTitles[0]}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab]}
              onPress={() => setActiveTab(1)}
            >
              {activeTab === 1 ? (
                <LinearGradient
                  colors={['#4F8EF7', '#7C6EFC']}
                  style={styles.tabActive}
                >
                  <Text style={styles.tabTextActive}>
                    {tabTitles[1]}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.tabInactive}>
                  <Text style={styles.tabText}>
                    {tabTitles[1]}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* 内容 */}
          <ScrollView style={styles.contentContainer}>
            {activeTab === 0 && renderContent(agreements.serviceAgreement.contents)}
            {activeTab === 1 && renderContent(agreements.privacyPolicy.contents)}
          </ScrollView>

          {/* 底部按钮 */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>不同意</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButtonContainer} onPress={handleAgree}>
              <LinearGradient
                colors={['#4F8EF7', '#7C6EFC']}
                style={styles.confirmButton}
              >
                <Text style={styles.confirmButtonText}>同意并继续</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default AgreementModal;