import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface DiaryEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  audioUrl: string | null;
  audioPath: string | null;
  audioExpiresAt: FirebaseFirestoreTypes.Timestamp | null;
  sttText: string | null;
  audioDurationMs: number | null;
  imageUrls: string[];
  imagePaths: string[];
  mood: string | null;
  stickers: string[];
  checklistItems: ChecklistItem[];
  isFavorite: boolean;
  entryDate: string; // 'YYYY-MM-DD'
  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt: FirebaseFirestoreTypes.Timestamp;
}

export interface DiaryEntryCreate {
  title: string;
  content: string;
  mood: string | null;
  stickers: string[];
  checklistItems: ChecklistItem[];
  isFavorite: boolean;
  entryDate: string;
}

export interface DiaryEntryUpdate {
  title?: string;
  content?: string;
  mood?: string | null;
  stickers?: string[];
  checklistItems?: ChecklistItem[];
  isFavorite?: boolean;
  audioUrl?: string | null;
  audioPath?: string | null;
  audioExpiresAt?: FirebaseFirestoreTypes.Timestamp | null;
  sttText?: string | null;
  audioDurationMs?: number | null;
  imageUrls?: string[];
  imagePaths?: string[];
}
