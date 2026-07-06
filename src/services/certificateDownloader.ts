import { Linking, NativeModules, Platform } from 'react-native';
import { getApiBaseUrl } from './environment';

interface CertificateDownloaderNativeModule {
  downloadImage: (imageUrl: string, fileName: string) => Promise<number>;
}

const CertificateDownloader = NativeModules.CertificateDownloader as CertificateDownloaderNativeModule | undefined;

async function normalizeImageUrl(imageUrl: string): Promise<string> {
  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  if (imageUrl.startsWith('//')) {
    return `https:${imageUrl}`;
  }

  /**
   * 证书接口可能返回相对路径，例如 /uploads/cert.jpg。
   * 这类资源地址也必须跟随开发者调试页选择的环境，否则接口切到了测试环境，
   * 图片下载仍可能去线上域名，导致联调结果不一致。
   */
  const apiBaseUrl = await getApiBaseUrl();

  if (imageUrl.startsWith('/')) {
    return `${apiBaseUrl}${imageUrl}`;
  }

  return `${apiBaseUrl}/${imageUrl}`;
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

  const normalizedImageUrl = await normalizeImageUrl(imageUrl);
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
