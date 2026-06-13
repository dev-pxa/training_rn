import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { fetchCertificateDetail } from '../../services/api';
import { downloadCertificateImage } from '../../services/certificateDownloader';
import { useFetchData } from '../../hooks/useFetchData';
import { CertificateDetail } from '../../types/exam';
import { RootStackParamList } from '../../types/navigation';
import styles from './styles';

type CertificateDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CertificateDetail'>;
type CertificateDetailScreenRouteProp = RouteProp<RootStackParamList, 'CertificateDetail'>;

interface CertificateDetailScreenProps {
  navigation: CertificateDetailScreenNavigationProp;
  route: CertificateDetailScreenRouteProp;
}

const CertificateDetailScreen: React.FC<CertificateDetailScreenProps> = ({ navigation, route }) => {
  const { certificateId } = route.params;
  const { data, loading, error, fetchData } = useFetchData<CertificateDetail>();
  const [toastText, setToastText] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchData(() => fetchCertificateDetail(certificateId));
  }, [certificateId, fetchData]);

  useEffect(() => {
    if (!toastText) return;

    const timer = setTimeout(() => {
      setToastText('');
    }, 1600);

    return () => clearTimeout(timer);
  }, [toastText]);

  const showToast = (message: string) => {
    setToastText(message);
  };

  const handleDownloadCertificate = async () => {
    if (!data || downloading) return;

    setDownloading(true);
    try {
      await downloadCertificateImage(data.imageUrl, data.certificateId);
      showToast('证书已保存到本地');
    } catch (err) {
      const message = err instanceof Error ? err.message : '证书下载失败，请稍后重试';
      console.warn('证书下载失败:', err);
      showToast(message);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F8EF7" />
          <Text style={styles.loadingText}>加载证书中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ErrorState
          message={error || '证书详情加载失败'}
          onRetry={() => fetchData(() => fetchCertificateDetail(certificateId))}
          onGoHome={() => navigation.navigate('Home')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.statusSpacer} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Icon name="Back" color="#1A1A2E" size={22} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>证书详情</Text>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={() => showToast('证书信息来自本次考试记录')}
          activeOpacity={0.8}
        >
          <Text style={styles.helpIcon}>?</Text>
        </TouchableOpacity>
      </View>

      {toastText ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastText}</Text>
        </View>
      ) : null}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#4F8EF7', '#7C6EFC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statusCard}
        >
          <View style={styles.statusHalo} />
          <View style={styles.statusPill}>
            <Icon name="VerifiedCheck" color="#FFFFFF" size={16} />
            <Text style={styles.statusPillText}>{data.statusText}</Text>
          </View>
          <Text style={styles.certificateName}>{data.name}</Text>
          <Text style={styles.certificateDesc}>{data.desc}</Text>
        </LinearGradient>

        <View style={styles.certificateWrap}>
          <TouchableOpacity
            style={styles.certificateImageButton}
            onPress={() => showToast('已打开证书大图预览')}
            activeOpacity={0.9}
          >
            <Image source={{ uri: data.imageUrl }} style={styles.certificateImage} resizeMode="cover" />
          </TouchableOpacity>
          <View style={styles.previewHint}>
            <Icon name="Search" color="#8A8A9A" size={14} />
            <Text style={styles.previewHintText}>{data.previewHint}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{data.infoSection.title}</Text>
          <View style={styles.infoList}>
            {data.infoSection.rows.map((item, index) => (
              <View
                key={`${item.label}-${item.value}`}
                style={[styles.infoRow, index === data.infoSection.rows.length - 1 && styles.lastInfoRow]}
              >
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.sectionCard, styles.noteCard]}>
          <Text style={styles.sectionTitle}>{data.nodeInfo.noteTitle}</Text>
          <View style={styles.noteList}>
            {data.nodeInfo.notes.map(note => (
              <View key={note} style={styles.noteItem}>
                <Text style={styles.noteBullet}>•</Text>
                <Text style={styles.noteText}>{note}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.primaryButtonWrap, downloading && styles.disabledButton]}
          onPress={handleDownloadCertificate}
          activeOpacity={0.9}
          disabled={downloading}
        >
          <LinearGradient
            colors={['#4F8EF7', '#7C6EFC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryButton}
          >
            <Icon name="CloudDownload" color="#FFFFFF" size={18} />
            <Text style={styles.primaryButtonText}>{downloading ? '下载中...' : '下载证书'}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => showToast('证书分享卡已生成')} activeOpacity={0.85}>
          <Icon name="Share" color="#1A1A2E" size={18} />
          <Text style={styles.secondaryButtonText}>分享证书</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.homeIndicator}>
        <View style={styles.homeIndicatorBar} />
      </View>
    </SafeAreaView>
  );
};

export default CertificateDetailScreen;
