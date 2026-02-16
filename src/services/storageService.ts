import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { AUDIO_CONFIG } from '../constants/audio';

export async function uploadAudio(
  userId: string,
  entryId: string,
  localUri: string
): Promise<{ downloadUrl: string; storagePath: string }> {
  const storagePath = `audio/${userId}/${entryId}.m4a`;
  const ref = storage().ref(storagePath);
  await ref.putFile(localUri);
  const downloadUrl = await ref.getDownloadURL();
  return { downloadUrl, storagePath };
}

export async function deleteAudio(storagePath: string): Promise<void> {
  try {
    await storage().ref(storagePath).delete();
  } catch (error: any) {
    if (error.code !== 'storage/object-not-found') {
      throw error;
    }
  }
}

export function getAudioExpiryTimestamp(): firestore.Timestamp {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + AUDIO_CONFIG.EXPIRY_DAYS);
  return firestore.Timestamp.fromDate(expiry);
}

export async function uploadImage(
  userId: string,
  entryId: string,
  localUri: string,
  index: number
): Promise<{ downloadUrl: string; storagePath: string }> {
  const storagePath = `images/${userId}/${entryId}_${index}.jpg`;
  const ref = storage().ref(storagePath);
  await ref.putFile(localUri);
  const downloadUrl = await ref.getDownloadURL();
  return { downloadUrl, storagePath };
}

export async function uploadImages(
  userId: string,
  entryId: string,
  localUris: string[]
): Promise<{ downloadUrls: string[]; storagePaths: string[] }> {
  const results = await Promise.all(
    localUris.map((uri, i) => uploadImage(userId, entryId, uri, i))
  );
  return {
    downloadUrls: results.map((r) => r.downloadUrl),
    storagePaths: results.map((r) => r.storagePath),
  };
}

export async function deleteImage(storagePath: string): Promise<void> {
  try {
    await storage().ref(storagePath).delete();
  } catch (error: any) {
    if (error.code !== 'storage/object-not-found') {
      throw error;
    }
  }
}

export async function deleteImages(storagePaths: string[]): Promise<void> {
  await Promise.all(storagePaths.map(deleteImage));
}
