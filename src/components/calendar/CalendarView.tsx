import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { useCalendarEntries } from '../../hooks/useCalendarEntries';
import { getEntriesForDate } from '../../services/diaryService';
import { useAuthContext } from '../../contexts/AuthContext';
import { DiaryEntry } from '../../types/diary';
import { MOOD_EMOJIS } from '../../constants/moods';
import { Colors } from '../../constants/colors';

export function CalendarView() {
  const router = useRouter();
  const { user } = useAuthContext();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const { markedDates, loading } = useCalendarEntries(year, month);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayEntries, setDayEntries] = useState<DiaryEntry[]>([]);
  const [loadingDay, setLoadingDay] = useState(false);

  const handleDayPress = useCallback(async (day: DateData) => {
    setSelectedDate(day.dateString);
    if (!user) return;
    setLoadingDay(true);
    try {
      const entries = await getEntriesForDate(user.uid, day.dateString);
      setDayEntries(entries);
    } catch {
      setDayEntries([]);
    } finally {
      setLoadingDay(false);
    }
  }, [user]);

  const handleMonthChange = useCallback((date: DateData) => {
    setYear(date.year);
    setMonth(date.month);
    setSelectedDate(null);
    setDayEntries([]);
  }, []);

  const allMarked = {
    ...markedDates,
    ...(selectedDate
      ? { [selectedDate]: { ...markedDates[selectedDate], selected: true, selectedColor: Colors.primary } }
      : {}),
  };

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={allMarked}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
        theme={{
          todayTextColor: Colors.primary,
          arrowColor: Colors.primary,
          dotColor: Colors.calendarDot,
          selectedDayBackgroundColor: Colors.primary,
        }}
      />
      {selectedDate && (
        <View style={styles.entriesList}>
          {loadingDay ? (
            <Text style={styles.hint}>Loading...</Text>
          ) : dayEntries.length === 0 ? (
            <Text style={styles.hint}>No entries for this date</Text>
          ) : (
            <FlatList
              data={dayEntries}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.entryRow}
                  onPress={() => router.push(`/entry/${item.id}`)}
                >
                  {item.mood && <Text style={styles.mood}>{MOOD_EMOJIS[item.mood]}</Text>}
                  <Text style={styles.entryTitle} numberOfLines={1}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  entriesList: {
    flex: 1,
    padding: 16,
  },
  hint: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mood: {
    fontSize: 20,
    marginRight: 8,
  },
  entryTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
    flex: 1,
  },
});
