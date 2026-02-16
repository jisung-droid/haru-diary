import firestore from '@react-native-firebase/firestore';
import { UserPreferences, DEFAULT_USER_PREFERENCES } from '../types/user';

function getPrefsDoc(userId: string) {
  return firestore().collection('users').doc(userId).collection('preferences').doc('main');
}

export async function getUserPreferences(userId: string): Promise<UserPreferences> {
  const doc = await getPrefsDoc(userId).get();
  if (!doc.exists) {
    await getPrefsDoc(userId).set(DEFAULT_USER_PREFERENCES);
    return DEFAULT_USER_PREFERENCES;
  }
  return doc.data() as UserPreferences;
}

export async function updateUserPreferences(
  userId: string,
  data: Partial<UserPreferences>
): Promise<void> {
  await getPrefsDoc(userId).set(data, { merge: true });
}

export function subscribeToPreferences(
  userId: string,
  callback: (prefs: UserPreferences) => void
) {
  return getPrefsDoc(userId).onSnapshot((doc) => {
    if (!doc.exists) {
      callback(DEFAULT_USER_PREFERENCES);
      return;
    }
    callback(doc.data() as UserPreferences);
  });
}

export async function addMoodOption(userId: string, mood: string): Promise<void> {
  await getPrefsDoc(userId).update({
    moodOptions: firestore.FieldValue.arrayUnion(mood),
  });
}

export async function removeMoodOption(userId: string, mood: string): Promise<void> {
  await getPrefsDoc(userId).update({
    moodOptions: firestore.FieldValue.arrayRemove(mood),
  });
}

export async function incrementTotalEntries(userId: string): Promise<void> {
  await getPrefsDoc(userId).update({
    totalEntries: firestore.FieldValue.increment(1),
  });
}

export async function updateStreakData(
  userId: string,
  currentStreak: number,
  longestStreak: number,
  lastEntryDate: string,
  plantStage: number
): Promise<void> {
  await getPrefsDoc(userId).update({
    currentStreak,
    longestStreak,
    lastEntryDate,
    plantStage,
  });
}
