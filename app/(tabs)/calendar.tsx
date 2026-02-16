import { View, StyleSheet } from 'react-native';
import { Colors } from '../../src/constants/colors';
import { CalendarView } from '../../src/components/calendar/CalendarView';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <CalendarView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
