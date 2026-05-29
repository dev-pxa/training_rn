import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from '../Icons';
import { Agreement } from '../../types/login';

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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E8EE',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F8F9FB',
    borderBottomWidth: 1,
    borderBottomColor: '#E7E8EE',
    gap: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 9999,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInactive: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 9999,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667085',
  },
  tabTextActive: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contentContainer: {
    maxHeight: 400,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    marginTop: 20,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 24,
    color: '#4B5563',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#E7E8EE',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#F8F9FB',
    borderWidth: 1,
    borderColor: '#E7E8EE',
  },
  cancelButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonContainer: {
    flex: 1,
  },
  confirmButton: {
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AgreementModal;