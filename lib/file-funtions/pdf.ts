import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import * as Linking from 'expo-linking';

export const openInBrowser = (url: string) => {
  Linking.openURL(url);
};

export async function sharePdfWithNativeApp(pdfUrl: string) {
  if (Platform.OS !== 'android') {
    alert('This function is Android-only!');
    return;
  }
  try {
    const filename = pdfUrl.substring(pdfUrl.lastIndexOf('/') + 1);
    const localPath = FileSystem.cacheDirectory + filename;
    const fileInfo = await FileSystem.getInfoAsync(localPath);
    if (!fileInfo.exists) {
      await FileSystem.downloadAsync(pdfUrl, localPath);
    }
    // Use the system dialog to open with a native app
    await Sharing.shareAsync(localPath);
  } catch (err) {
    console.error('Failed to share PDF:', err);
  }
}
