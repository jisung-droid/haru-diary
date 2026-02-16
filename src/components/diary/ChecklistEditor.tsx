import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { ChecklistItem } from '../../types/diary';
import { Colors } from '../../constants/colors';

interface ChecklistEditorProps {
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
}

export function ChecklistEditor({ items, onChange }: ChecklistEditorProps) {
  const [newText, setNewText] = useState('');

  const addItem = () => {
    const text = newText.trim();
    if (!text) return;
    onChange([...items, { id: Date.now().toString(), text, checked: false }]);
    setNewText('');
  };

  const toggleItem = (id: string) => {
    onChange(items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Checklist</Text>
      {items.map((item) => (
        <View key={item.id} style={styles.row}>
          <TouchableOpacity onPress={() => toggleItem(item.id)} style={styles.checkbox}>
            <Text style={styles.checkIcon}>{item.checked ? '☑' : '☐'}</Text>
          </TouchableOpacity>
          <Text style={[styles.itemText, item.checked && styles.checked]}>{item.text}</Text>
          <TouchableOpacity onPress={() => removeItem(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.remove}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}
      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          value={newText}
          onChangeText={setNewText}
          placeholder="Add item..."
          placeholderTextColor={Colors.textLight}
          onSubmitEditing={addItem}
          returnKeyType="done"
        />
        <TouchableOpacity onPress={addItem} style={styles.addButton}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    paddingVertical: 6,
  },
  checkbox: {
    marginRight: 8,
  },
  checkIcon: {
    fontSize: 20,
    color: Colors.primary,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  checked: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  remove: {
    fontSize: 14,
    color: Colors.textSecondary,
    paddingLeft: 8,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: Colors.text,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
