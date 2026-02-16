import { View, Text, StyleSheet } from 'react-native';
import { PLANT_STAGES, PLANT_EMOJIS } from '../../constants/plantStages';
import { Colors } from '../../constants/colors';

interface PlantGrowthProps {
  plantStage: number;
  currentStreak: number;
}

export function PlantGrowth({ plantStage, currentStreak }: PlantGrowthProps) {
  const stage = PLANT_STAGES[plantStage] || PLANT_STAGES[0];
  const emoji = PLANT_EMOJIS[stage.image];
  const nextStage = PLANT_STAGES[plantStage + 1];
  const progress = nextStage
    ? ((currentStreak - stage.minStreak) / (nextStage.minStreak - stage.minStreak)) * 100
    : 100;

  return (
    <View style={styles.container}>
      <Text style={styles.plant}>{emoji}</Text>
      <Text style={styles.name}>{stage.name}</Text>
      <Text style={styles.description}>{stage.description}</Text>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${Math.min(progress, 100)}%` }]} />
      </View>

      {nextStage ? (
        <Text style={styles.hint}>
          {nextStage.minStreak - currentStreak} more day{nextStage.minStreak - currentStreak !== 1 ? 's' : ''} to {nextStage.name}
        </Text>
      ) : (
        <Text style={styles.hint}>Max level reached!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  plant: {
    fontSize: 64,
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  progressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  hint: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
