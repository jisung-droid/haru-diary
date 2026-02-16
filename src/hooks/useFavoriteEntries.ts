import { useEffect, useState } from 'react';
import { DiaryEntry } from '../types/diary';
import { subscribeToFavoriteEntries } from '../services/diaryService';
import { useAuthContext } from '../contexts/AuthContext';

export function useFavoriteEntries() {
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
    const unsubscribe = subscribeToFavoriteEntries(
      user.uid,
      (newEntries) => {
        setEntries(newEntries);
        setLoading(false);
        setError(null);
      }
    );

    return unsubscribe;
  }, [user?.uid]);

  return { entries, loading, error };
}
