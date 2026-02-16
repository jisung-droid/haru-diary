import { useState, useMemo, useRef, useCallback } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../../src/constants/colors';
import { useDiaryEntries } from '../../src/hooks/useDiaryEntries';
import { TimelineList } from '../../src/components/timeline/TimelineList';
import { LoadingSpinner } from '../../src/components/ui/LoadingSpinner';
import { EmptyState } from '../../src/components/ui/EmptyState';

export default function SearchScreen() {
  const { entries, loading } = useDiaryEntries();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChangeText = useCallback((text: string) => {
    setQuery(text);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQuery(text), 300);
  }, []);

  const filteredEntries = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return [];
    return entries.filter((entry) => {
      const title = entry.title?.toLowerCase() ?? '';
      const content = entry.content?.toLowerCase() ?? '';
      const stt = entry.sttText?.toLowerCase() ?? '';
      return title.includes(q) || content.includes(q) || stt.includes(q);
    });
  }, [entries, debouncedQuery]);

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search diary entries..."
          placeholderTextColor={Colors.textSecondary}
          value={query}
          onChangeText={handleChangeText}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>
      {!debouncedQuery.trim() ? (
        <EmptyState icon="🔍" message="Search your diary entries by title, content, or voice notes." />
      ) : filteredEntries.length === 0 ? (
        <EmptyState icon="🔍" message="No entries found. Try a different search term." />
      ) : (
        <TimelineList entries={filteredEntries} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchBar: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.text,
  },
});
