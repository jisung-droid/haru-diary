import { useAuthContext } from '../contexts/AuthContext';
import { useUserPreferencesContext } from '../contexts/UserPreferencesContext';
import { updateStreakData, incrementTotalEntries } from '../services/userPreferencesService';
import { getTodayString } from '../utils/dateUtils';
import { daysBetween } from '../utils/dateUtils';
import { getPlantStageIndex } from '../utils/streakUtils';

export function useStreak() {
  const { user } = useAuthContext();
  const { preferences } = useUserPreferencesContext();

  const recordEntry = async () => {
    if (!user) return;

    const today = getTodayString();
    const { lastEntryDate, currentStreak, longestStreak } = preferences;

    let newStreak = 1;
    if (lastEntryDate) {
      const gap = daysBetween(lastEntryDate, today);
      if (gap === 0) {
        // Already wrote today, don't change streak
        return;
      } else if (gap === 1) {
        newStreak = currentStreak + 1;
      }
    }

    const newLongest = Math.max(longestStreak, newStreak);
    const plantStage = getPlantStageIndex(newStreak);

    await Promise.all([
      updateStreakData(user.uid, newStreak, newLongest, today, plantStage),
      incrementTotalEntries(user.uid),
    ]);
  };

  return { recordEntry };
}
