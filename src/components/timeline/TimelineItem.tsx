import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { DiaryEntry } from '../../types/diary';
import { MOOD_EMOJIS } from '../../constants/moods';
import { Colors } from '../../constants/colors';
import { toggleFavorite } from '../../services/diaryService';

interface TimelineItemProps {
  entry: DiaryEntry;
}

export function TimelineItem({ entry }: TimelineItemProps) {
  const router = useRouter();

  const handleFavorite = () => {
    toggleFavorite(entry.id, !entry.isFavorite);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/entry/${entry.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {entry.mood && <Text style={styles.mood}>{MOOD_EMOJIS[entry.mood]}</Text>}
          <Text style={styles.title} numberOfLines={1}>{entry.title}</Text>
        </View>
        <TouchableOpacity onPress={handleFavorite} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.star}>{entry.isFavorite ? '⭐' : '☆'}</Text>
        </TouchableOpacity>
      </View>

      {entry.content ? (
        <Text style={styles.content} numberOfLines={2}>{entry.content}</Text>
      ) : null}

      {entry.stickers.length > 0 && (
        <Text style={styles.stickers}>{entry.stickers.join(' ')}</Text>
      )}

      {entry.checklistItems.length > 0 && (
        <Text style={styles.checklist}>
          {entry.checklistItems.filter((i) => i.checked).length}/{entry.checklistItems.length} completed
        </Text>
      )}

      {(entry.imageUrls?.length ?? 0) > 0 && (
        <Text style={styles.imageCount}>
          📷 {entry.imageUrls.length} photo{entry.imageUrls.length > 1 ? 's' : ''}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  mood: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  star: {
    fontSize: 20,
  },
  content: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  stickers: {
    fontSize: 16,
    marginTop: 8,
  },
  checklist: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  imageCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 6,
  },
});
