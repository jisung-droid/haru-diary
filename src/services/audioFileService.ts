import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export async function downloadAndShareAudio(
  audioUrl: string,
  entryId: string
): Promise<void> {
  const fileUri = `${FileSystem.cacheDirectory}diary-${entryId}.m4a`;
  const download = await FileSystem.downloadAsync(audioUrl, fileUri);
  await Sharing.shareAsync(download.uri, {
    mimeType: 'audio/mp4',
    dialogTitle: 'Save Audio Recording',
  });
}
