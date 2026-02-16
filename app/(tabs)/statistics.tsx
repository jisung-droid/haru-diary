import { ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../../src/constants/colors';
import { useStatistics } from '../../src/hooks/useStatistics';
import { LoadingSpinner } from '../../src/components/ui/LoadingSpinner';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { StatsOverview } from '../../src/components/statistics/StatsOverview';
import { MoodChart } from '../../src/components/statistics/MoodChart';
import { PlantGrowth } from '../../src/components/statistics/PlantGrowth';

export default function StatisticsScreen() {
  const { stats, loading } = useStatistics();

  if (loading) return <LoadingSpinner />;
  if (!stats) return <EmptyState icon="📊" message="No statistics yet. Start writing to see your progress!" />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PlantGrowth plantStage={stats.plantStage} currentStreak={stats.currentStreak} />
      <StatsOverview
        totalEntries={stats.totalEntries}
        currentStreak={stats.currentStreak}
        longestStreak={stats.longestStreak}
      />
      <MoodChart moodDistribution={stats.moodDistribution} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
});
