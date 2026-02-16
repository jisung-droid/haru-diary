import { View, Text, StyleSheet } from 'react-native';
import { MOOD_EMOJIS, MOOD_COLORS, DEFAULT_MOODS } from '../../constants/moods';
import { Colors } from '../../constants/colors';

interface MoodChartProps {
  moodDistribution: Record<string, number>;
}

export function MoodChart({ moodDistribution }: MoodChartProps) {
  const total = Object.values(moodDistribution).reduce((a, b) => a + b, 0);

  if (total === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Mood Distribution</Text>
        <Text style={styles.empty}>No mood data yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood Distribution</Text>
      {DEFAULT_MOODS.map((mood) => {
        const count = moodDistribution[mood] || 0;
        const percentage = total > 0 ? (count / total) * 100 : 0;
        return (
          <View key={mood} style={styles.row}>
            <Text style={styles.emoji}>{MOOD_EMOJIS[mood]}</Text>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  { width: `${Math.max(percentage, 2)}%`, backgroundColor: MOOD_COLORS[mood] },
                ]}
              />
            </View>
            <Text style={styles.count}>{count}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  empty: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  emoji: {
    fontSize: 20,
    width: 32,
  },
  barContainer: {
    flex: 1,
    height: 20,
    backgroundColor: Colors.background,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  bar: {
    height: '100%',
    borderRadius: 10,
  },
  count: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    width: 28,
    textAlign: 'right',
  },
});
