import { FlatList, Text, StyleSheet } from 'react-native';
import { DiaryEntry } from '../../types/diary';
import { TimelineItem } from './TimelineItem';
import { formatEntryDate } from '../../utils/dateUtils';
import { Colors } from '../../constants/colors';

interface TimelineListProps {
  entries: DiaryEntry[];
}

interface Section {
  type: 'header' | 'entry';
  date?: string;
  entry?: DiaryEntry;
  key: string;
}

export function TimelineList({ entries }: TimelineListProps) {
  const sections: Section[] = [];
  let lastDate = '';

  entries.forEach((entry) => {
    if (entry.entryDate !== lastDate) {
      lastDate = entry.entryDate;
      sections.push({ type: 'header', date: entry.entryDate, key: `header-${entry.entryDate}` });
    }
    sections.push({ type: 'entry', entry, key: entry.id });
  });

  return (
    <FlatList
      data={sections}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => {
        if (item.type === 'header') {
          return <Text style={styles.dateHeader}>{formatEntryDate(item.date!)}</Text>;
        }
        return <TimelineItem entry={item.entry!} />;
      }}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
});
