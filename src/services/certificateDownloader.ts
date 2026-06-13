import { Linking, NativeModules, Platform } from 'react-native';
import { API_BASE_URL } from './environment';

interface CertificateDownloaderNativeModule {
  downloadImage: (imageUrl: string, fileName: string) => Promise<number>;
}

const CertificateDownloader = NativeModules.CertificateDownloader as CertificateDownloaderNativeModule | undefined;

function normalizeImageUrl(imageUrl: string): string {
  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  if (imageUrl.startsWith('//')) {
    return `https:${imageUrl}`;
  }

  if (imageUrl.startsWith('/')) {
    return `${API_BASE_URL}${imageUrl}`;
  }

  return `${API_BASE_URL}/${imageUrl}`;
}

function getImageExtension(imageUrl: string): string {
  const urlWithoutQuery = imageUrl.split('?')[0] || '';
  const extension = urlWithoutQuery.split('.').pop()?.toLowerCase();

  if (extension && ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)) {
    return extension;
  }

  return 'jpg';
}

export async function downloadCertificateImage(imageUrl: string, certificateId: number): Promise<void> {
  if (!imageUrl) {
    throw new Error('证书图片地址为空');
  }

  const normalizedImageUrl = normalizeImageUrl(imageUrl);
  const extension = getImageExtension(normalizedImageUrl);
  const fileName = `certificate_${certificateId}.${extension}`;

  if (CertificateDownloader?.downloadImage) {
    await CertificateDownloader.downloadImage(normalizedImageUrl, fileName);
    return;
  }

  if (Platform.OS === 'android') {
    throw new Error('证书下载模块未注册，请重新安装应用后重试');
  }

  await Linking.openURL(normalizedImageUrl);
}
