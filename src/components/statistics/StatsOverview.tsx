import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface StatsOverviewProps {
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
}

export function StatsOverview({ totalEntries, currentStreak, longestStreak }: StatsOverviewProps) {
  return (
    <View style={styles.row}>
      <StatCard label="Total Entries" value={String(totalEntries)} icon="📝" />
      <StatCard label="Current Streak" value={`${currentStreak}d`} icon="🔥" />
      <StatCard label="Longest Streak" value={`${longestStreak}d`} icon="🏆" />
    </View>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  label: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
});
