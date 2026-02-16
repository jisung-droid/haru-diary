import { View, StyleSheet } from 'react-native';
import { Colors } from '../../src/constants/colors';
import { useFavoriteEntries } from '../../src/hooks/useFavoriteEntries';
import { TimelineList } from '../../src/components/timeline/TimelineList';
import { LoadingSpinner } from '../../src/components/ui/LoadingSpinner';
import { EmptyState } from '../../src/components/ui/EmptyState';

export default function FavoritesScreen() {
  const { entries, loading } = useFavoriteEntries();

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      {entries.length === 0 ? (
        <EmptyState icon="⭐" message="No favorite entries yet. Star your favorite moments!" />
      ) : (
        <TimelineList entries={entries} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
