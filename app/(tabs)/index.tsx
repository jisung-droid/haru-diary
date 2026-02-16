import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/colors';
import { useDiaryEntries } from '../../src/hooks/useDiaryEntries';
import { TimelineList } from '../../src/components/timeline/TimelineList';
import { LoadingSpinner } from '../../src/components/ui/LoadingSpinner';
import { EmptyState } from '../../src/components/ui/EmptyState';

export default function TimelineScreen() {
  const { entries, loading } = useDiaryEntries();
  const router = useRouter();

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      {entries.length === 0 ? (
        <EmptyState icon="📝" message="No diary entries yet. Tap + to write your first entry!" />
      ) : (
        <TimelineList entries={entries} />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/entry/new')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '300',
    marginTop: -2,
  },
});
