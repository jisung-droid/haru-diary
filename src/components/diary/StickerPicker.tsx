import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { STICKER_GRID } from '../../constants/stickers';
import { Colors } from '../../constants/colors';

interface StickerPickerProps {
  selected: string[];
  onToggle: (sticker: string) => void;
}

export function StickerPicker({ selected, onToggle }: StickerPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Stickers</Text>
      {STICKER_GRID.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((sticker) => (
            <TouchableOpacity
              key={sticker}
              style={[styles.cell, selected.includes(sticker) && styles.selected]}
              onPress={() => onToggle(sticker)}
            >
              <Text style={styles.emoji}>{sticker}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
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
    marginBottom: 4,
  },
  cell: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '15',
  },
  emoji: {
    fontSize: 24,
  },
});
