import { getTodayString, daysBetween } from './dateUtils';

export function calculateStreak(lastEntryDate: string | null, currentStreak: number): {
  currentStreak: number;
  isWithered: boolean;
} {
  if (!lastEntryDate) {
    return { currentStreak: 0, isWithered: false };
  }

  const today = getTodayString();
  const gap = daysBetween(lastEntryDate, today);

  if (gap === 0) {
    // Wrote today
    return { currentStreak, isWithered: false };
  } else if (gap === 1) {
    // Yesterday was last entry, streak still alive but needs entry today
    return { currentStreak, isWithered: false };
  } else {
    // Streak broken
    return { currentStreak: 0, isWithered: true };
  }
}

export function getPlantStageIndex(streak: number): number {
  if (streak >= 15) return 4;
  if (streak >= 8) return 3;
  if (streak >= 4) return 2;
  if (streak >= 1) return 1;
  return 0;
}
