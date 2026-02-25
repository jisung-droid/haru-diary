import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { useAuthContext } from '../../src/contexts/AuthContext';
import { createEntry, updateEntry } from '../../src/services/diaryService';
import { uploadAudio, getAudioExpiryTimestamp, uploadImages } from '../../src/services/storageService';
import { useStreak } from '../../src/hooks/useStreak';
import { useSTT } from '../../src/hooks/useSTT';
import { getTodayString } from '../../src/utils/dateUtils';
import { ChecklistItem } from '../../src/types/diary';
import { MoodPicker } from '../../src/components/diary/MoodPicker';
import { StickerPicker } from '../../src/components/diary/StickerPicker';
import { ChecklistEditor } from '../../src/components/diary/ChecklistEditor';
import { AudioRecorder } from '../../src/components/diary/AudioRecorder';
import { ImagePicker } from '../../src/components/diary/ImagePicker';

export default function NewEntryScreen() {
  const router = useRouter();
  const { user } = useAuthContext();
  const insets = useSafeAreaInsets();
  const { recordEntry } = useStreak();
  const { transcribe, transcribing } = useSTT();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<string | null>(null);
  const [stickers, setStickers] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [audioDurationMs, setAudioDurationMs] = useState(0);
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleSticker = (sticker: string) => {
    setStickers((prev) =>
      prev.includes(sticker) ? prev.filter((s) => s !== sticker) : [...prev, sticker]
    );
  };

  const handleSave = async () => {
    if (!user) return;
    if (!title.trim()) {
      Alert.alert('Title required', 'Please enter a title for your diary entry.');
      return;
    }

    setSaving(true);
    try {
      const entryId = await createEntry(user.uid, {
        title: title.trim(),
        content: content.trim(),
        mood,
        stickers,
        checklistItems: checklist,
        isFavorite: false,
        entryDate: getTodayString(),
      });

      // Upload audio if recorded
      if (audioUri) {
        const { downloadUrl, storagePath } = await uploadAudio(user.uid, entryId, audioUri);
        await updateEntry(entryId, {
          audioUrl: downloadUrl,
          audioPath: storagePath,
          audioExpiresAt: getAudioExpiryTimestamp(),
          audioDurationMs,
        });

        // Trigger STT in background
        transcribe(entryId, storagePath).catch(() => {});
      }

      // Upload images if any
      if (imageUris.length > 0) {
        const { downloadUrls, storagePaths } = await uploadImages(user.uid, entryId, imageUris);
        await updateEntry(entryId, {
          imageUrls: downloadUrls,
          imagePaths: storagePaths,
        });
      }

      await recordEntry();
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save entry');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Entry</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text style={[styles.save, saving && styles.disabled]}>
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor={Colors.textLight}
          autoFocus
        />
        <TextInput
          style={styles.contentInput}
          value={content}
          onChangeText={setContent}
          placeholder="Write your thoughts..."
          placeholderTextColor={Colors.textLight}
          multiline
          textAlignVertical="top"
        />

        <MoodPicker selected={mood} onSelect={setMood} />
        <StickerPicker selected={stickers} onToggle={toggleSticker} />
        <ChecklistEditor items={checklist} onChange={setChecklist} />
        <ImagePicker images={imageUris} onImagesChange={setImageUris} />
        <AudioRecorder
          onRecorded={(uri, duration) => {
            setAudioUri(uri);
            setAudioDurationMs(duration);
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },
  cancel: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  save: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    paddingVertical: 4,
  },
  contentInput: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    minHeight: 120,
    marginBottom: 20,
  },
});
