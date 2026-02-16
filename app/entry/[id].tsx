import { useState, useEffect } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../src/constants/colors';
import { MOOD_EMOJIS } from '../../src/constants/moods';
import { useDiaryEntry } from '../../src/hooks/useDiaryEntry';
import { updateEntry, deleteEntry } from '../../src/services/diaryService';
import { uploadImages, deleteImages } from '../../src/services/storageService';
import { useAuthContext } from '../../src/contexts/AuthContext';
import { ChecklistItem } from '../../src/types/diary';
import { MoodPicker } from '../../src/components/diary/MoodPicker';
import { StickerPicker } from '../../src/components/diary/StickerPicker';
import { ChecklistEditor } from '../../src/components/diary/ChecklistEditor';
import { AudioPlayer } from '../../src/components/diary/AudioPlayer';
import { ImagePicker } from '../../src/components/diary/ImagePicker';
import { ImageGallery } from '../../src/components/diary/ImageGallery';
import { LoadingSpinner } from '../../src/components/ui/LoadingSpinner';
import { formatEntryDate } from '../../src/utils/dateUtils';

export default function EntryDetailScreen() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entry, loading } = useDiaryEntry(id || null);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<string | null>(null);
  const [stickers, setStickers] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
      setMood(entry.mood);
      setStickers(entry.stickers);
      setChecklist(entry.checklistItems);
      setImageUris(entry.imageUrls || []);
    }
  }, [entry?.id]);

  const handleSave = async () => {
    if (!id || !title.trim()) return;
    setSaving(true);
    try {
      // Determine new local images (not already uploaded URLs)
      const existingUrls = entry?.imageUrls || [];
      const newLocalUris = imageUris.filter((uri) => !uri.startsWith('http'));
      let finalUrls = imageUris.filter((uri) => uri.startsWith('http'));
      let finalPaths = (entry?.imagePaths || []).filter((_, i) => finalUrls.includes(existingUrls[i]));

      // Upload new images
      if (newLocalUris.length > 0 && user) {
        const { downloadUrls, storagePaths } = await uploadImages(user.uid, id, newLocalUris);
        finalUrls = [...finalUrls, ...downloadUrls];
        finalPaths = [...finalPaths, ...storagePaths];
      }

      // Delete removed images
      const removedPaths = (entry?.imagePaths || []).filter(
        (_, i) => !imageUris.includes(existingUrls[i])
      );
      if (removedPaths.length > 0) {
        await deleteImages(removedPaths).catch(() => {});
      }

      await updateEntry(id, {
        title: title.trim(),
        content: content.trim(),
        mood,
        stickers,
        checklistItems: checklist,
        imageUrls: finalUrls,
        imagePaths: finalPaths,
      });
      setEditing(false);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteEntry(id!);
            router.back();
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to delete');
          }
        },
      },
    ]);
  };

  const toggleSticker = (sticker: string) => {
    setStickers((prev) =>
      prev.includes(sticker) ? prev.filter((s) => s !== sticker) : [...prev, sticker]
    );
  };

  if (loading) return <LoadingSpinner />;
  if (!entry) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Entry not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          {editing ? (
            <>
              <TouchableOpacity onPress={() => setEditing(false)}>
                <Text style={styles.cancelEdit}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} disabled={saving}>
                <Text style={[styles.saveEdit, saving && styles.disabled]}>
                  {saving ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={() => setEditing(true)}>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.date}>{formatEntryDate(entry.entryDate)}</Text>

        {editing ? (
          <>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Title"
              placeholderTextColor={Colors.textLight}
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
          </>
        ) : (
          <>
            <Text style={styles.titleDisplay}>{entry.title}</Text>
            {entry.content ? <Text style={styles.contentDisplay}>{entry.content}</Text> : null}

            {entry.mood && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Mood</Text>
                <Text style={styles.moodDisplay}>
                  {MOOD_EMOJIS[entry.mood]} {entry.mood}
                </Text>
              </View>
            )}

            {entry.stickers.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Stickers</Text>
                <Text style={styles.stickersDisplay}>{entry.stickers.join('  ')}</Text>
              </View>
            )}

            {entry.checklistItems.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Checklist</Text>
                {entry.checklistItems.map((item) => (
                  <Text key={item.id} style={styles.checkItem}>
                    {item.checked ? '☑' : '☐'} {item.text}
                  </Text>
                ))}
              </View>
            )}

            <ImageGallery imageUrls={entry.imageUrls || []} />
          </>
        )}

        <AudioPlayer
          audioUrl={entry.audioUrl}
          audioExpiresAt={entry.audioExpiresAt}
          audioDurationMs={entry.audioDurationMs}
        />

        {entry.sttText && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Transcription</Text>
            <Text style={styles.sttText}>{entry.sttText}</Text>
          </View>
        )}
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
    paddingTop: 56,
    paddingBottom: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  back: {
    fontSize: 16,
    color: Colors.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  editButton: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  deleteButton: {
    fontSize: 16,
    color: Colors.error,
    fontWeight: '600',
  },
  cancelEdit: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  saveEdit: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
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
  date: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
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
  titleDisplay: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  contentDisplay: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  moodDisplay: {
    fontSize: 18,
    color: Colors.text,
    textTransform: 'capitalize',
  },
  stickersDisplay: {
    fontSize: 24,
  },
  checkItem: {
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 2,
  },
  sttText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  notFound: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  backLink: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
});
