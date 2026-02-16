import firestore from '@react-native-firebase/firestore';
import { DiaryEntry, DiaryEntryCreate, DiaryEntryUpdate } from '../types/diary';

const COLLECTION = 'diaryEntries';

function getCollection() {
  return firestore().collection(COLLECTION);
}

export async function createEntry(userId: string, data: DiaryEntryCreate): Promise<string> {
  const now = firestore.Timestamp.now();
  const docRef = await getCollection().add({
    ...data,
    userId,
    audioUrl: null,
    audioPath: null,
    audioExpiresAt: null,
    sttText: null,
    audioDurationMs: null,
    imageUrls: [],
    imagePaths: [],
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function updateEntry(entryId: string, data: DiaryEntryUpdate): Promise<void> {
  await getCollection().doc(entryId).update({
    ...data,
    updatedAt: firestore.Timestamp.now(),
  });
}

export async function deleteEntry(entryId: string): Promise<void> {
  await getCollection().doc(entryId).delete();
}

export async function getEntry(entryId: string): Promise<DiaryEntry | null> {
  const doc = await getCollection().doc(entryId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as DiaryEntry;
}

export function subscribeToEntries(
  userId: string,
  callback: (entries: DiaryEntry[]) => void,
  options?: { limit?: number; startAfterDate?: string }
) {
  let query = getCollection()
    .where('userId', '==', userId)
    .orderBy('entryDate', 'desc');

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  return query.onSnapshot((snapshot) => {
    const entries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as DiaryEntry[];
    callback(entries);
  });
}

export function subscribeToEntry(
  entryId: string,
  callback: (entry: DiaryEntry | null) => void
) {
  return getCollection().doc(entryId).onSnapshot((doc) => {
    if (!doc.exists) {
      callback(null);
      return;
    }
    callback({ id: doc.id, ...doc.data() } as DiaryEntry);
  });
}

export async function getEntriesForMonth(
  userId: string,
  year: number,
  month: number
): Promise<{ entryDate: string }[]> {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endMonth = month === 12 ? 1 : month + 1;
  const endYear = month === 12 ? year + 1 : year;
  const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

  const snapshot = await getCollection()
    .where('userId', '==', userId)
    .where('entryDate', '>=', startDate)
    .where('entryDate', '<', endDate)
    .get();

  return snapshot.docs.map((doc) => ({
    entryDate: doc.data().entryDate as string,
  }));
}

export async function getEntriesForDate(
  userId: string,
  date: string
): Promise<DiaryEntry[]> {
  const snapshot = await getCollection()
    .where('userId', '==', userId)
    .where('entryDate', '==', date)
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as DiaryEntry[];
}

export async function toggleFavorite(entryId: string, isFavorite: boolean): Promise<void> {
  await updateEntry(entryId, { isFavorite });
}

export async function getFavoriteEntries(userId: string): Promise<DiaryEntry[]> {
  const snapshot = await getCollection()
    .where('userId', '==', userId)
    .where('isFavorite', '==', true)
    .orderBy('entryDate', 'desc')
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as DiaryEntry[];
}

export function subscribeToFavoriteEntries(
  userId: string,
  callback: (entries: DiaryEntry[]) => void
) {
  return getCollection()
    .where('userId', '==', userId)
    .where('isFavorite', '==', true)
    .orderBy('entryDate', 'desc')
    .onSnapshot((snapshot) => {
      const entries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as DiaryEntry[];
      callback(entries);
    });
}
