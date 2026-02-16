import { useEffect, useState } from 'react';
import { getEntriesForMonth } from '../services/diaryService';
import { useAuthContext } from '../contexts/AuthContext';

export function useCalendarEntries(year: number, month: number) {
  const { user } = useAuthContext();
  const [markedDates, setMarkedDates] = useState<Record<string, { marked: boolean; dotColor: string }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setMarkedDates({});
      setLoading(false);
      return;
    }

    setLoading(true);
    getEntriesForMonth(user.uid, year, month)
      .then((entries) => {
        const dates: Record<string, { marked: boolean; dotColor: string }> = {};
        entries.forEach(({ entryDate }) => {
          dates[entryDate] = { marked: true, dotColor: '#4CAF50' };
        });
        setMarkedDates(dates);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.uid, year, month]);

  return { markedDates, loading };
}
