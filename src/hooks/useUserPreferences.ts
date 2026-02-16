import { useAuthContext } from '../contexts/AuthContext';
import { useUserPreferencesContext } from '../contexts/UserPreferencesContext';
import {
  addMoodOption,
  removeMoodOption,
  updateUserPreferences,
} from '../services/userPreferencesService';

export function useUserPreferences() {
  const { user } = useAuthContext();
  const { preferences, loading } = useUserPreferencesContext();

  const addMood = async (mood: string) => {
    if (!user) return;
    await addMoodOption(user.uid, mood);
  };

  const removeMood = async (mood: string) => {
    if (!user) return;
    await removeMoodOption(user.uid, mood);
  };

  const updatePreferences = async (data: Partial<typeof preferences>) => {
    if (!user) return;
    await updateUserPreferences(user.uid, data);
  };

  return {
    preferences,
    loading,
    addMood,
    removeMood,
    updatePreferences,
  };
}
