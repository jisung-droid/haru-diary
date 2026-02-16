import { useMemo } from 'react';
import { DiaryEntry } from '../types/diary';
import { DiaryStatistics } from '../types/statistics';
import { useDiaryEntries } from './useDiaryEntries';
import { useUserPreferencesContext } from '../contexts/UserPreferencesContext';
import { getWeekKey, getMonthKey } from '../utils/dateUtils';
import { getPlantStageIndex } from '../utils/streakUtils';

export function useStatistics(): { stats: DiaryStatistics | null; loading: boolean } {
  const { entries, loading: entriesLoading } = useDiaryEntries();
  const { preferences, loading: prefsLoading } = useUserPreferencesContext();

  const stats = useMemo(() => {
    if (entriesLoading || prefsLoading) return null;

    const entriesPerWeek: Record<string, number> = {};
    const entriesPerMonth: Record<string, number> = {};
    const moodDistribution: Record<string, number> = {};
    const stickerCounts: Record<string, number> = {};

    entries.forEach((entry) => {
      // Per week
      const weekKey = getWeekKey(entry.entryDate);
      entriesPerWeek[weekKey] = (entriesPerWeek[weekKey] || 0) + 1;

      // Per month
      const monthKey = getMonthKey(entry.entryDate);
      entriesPerMonth[monthKey] = (entriesPerMonth[monthKey] || 0) + 1;

      // Mood
      if (entry.mood) {
        moodDistribution[entry.mood] = (moodDistribution[entry.mood] || 0) + 1;
      }

      // Stickers
      entry.stickers.forEach((sticker) => {
        stickerCounts[sticker] = (stickerCounts[sticker] || 0) + 1;
      });
    });

    const stickerRanking = Object.entries(stickerCounts)
      .map(([emoji, count]) => ({ emoji, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalEntries: preferences.totalEntries,
      currentStreak: preferences.currentStreak,
      longestStreak: preferences.longestStreak,
      entriesPerWeek,
      entriesPerMonth,
      moodDistribution,
      stickerRanking,
      plantStage: getPlantStageIndex(preferences.currentStreak),
    };
  }, [entries, entriesLoading, preferences, prefsLoading]);

  return { stats, loading: entriesLoading || prefsLoading };
}
