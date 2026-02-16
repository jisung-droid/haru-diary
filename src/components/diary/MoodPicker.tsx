import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { DEFAULT_MOODS, MOOD_EMOJIS, MOOD_COLORS } from '../../constants/moods';
import { Colors } from '../../constants/colors';

interface MoodPickerProps {
  selected: string | null;
  onSelect: (mood: string | null) => void;
}

export function MoodPicker({ selected, onSelect }: MoodPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>How are you feeling?</Text>
      <View style={styles.row}>
        {DEFAULT_MOODS.map((mood) => (
          <TouchableOpacity
            key={mood}
            style={[
              styles.item,
              selected === mood && { borderColor: MOOD_COLORS[mood], backgroundColor: MOOD_COLORS[mood] + '20' },
            ]}
            onPress={() => onSelect(selected === mood ? null : mood)}
          >
            <Text style={styles.emoji}>{MOOD_EMOJIS[mood]}</Text>
            <Text style={[styles.name, selected === mood && { color: MOOD_COLORS[mood] }]}>{mood}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 58,
  },
  emoji: {
    fontSize: 28,
    marginBottom: 2,
  },
  name: {
    fontSize: 11,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
});
