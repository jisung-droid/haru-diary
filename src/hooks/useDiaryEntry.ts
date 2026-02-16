import { useEffect, useState } from 'react';
import { DiaryEntry } from '../types/diary';
import { subscribeToEntry } from '../services/diaryService';

export function useDiaryEntry(entryId: string | null) {
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!entryId) {
      setEntry(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToEntry(entryId, (data) => {
      setEntry(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [entryId]);

  return { entry, loading };
}
