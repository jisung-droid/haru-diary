import { useEffect, useState } from 'react';
import { DiaryEntry } from '../types/diary';
import { subscribeToEntries } from '../services/diaryService';
import { useAuthContext } from '../contexts/AuthContext';

export function useDiaryEntries(limit?: number) {
  const { user } = useAuthContext();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToEntries(
      user.uid,
      (newEntries) => {
        setEntries(newEntries);
        setLoading(false);
        setError(null);
      },
      { limit }
    );

    return unsubscribe;
  }, [user?.uid, limit]);

  return { entries, loading, error };
}
