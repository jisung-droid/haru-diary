export interface UserPreferences {
  moodOptions: string[];
  plantStage: number;
  currentStreak: number;
  longestStreak: number;
  lastEntryDate: string | null;
  totalEntries: number;
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  moodOptions: ['great', 'good', 'okay', 'bad', 'terrible'],
  plantStage: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastEntryDate: null,
  totalEntries: 0,
};
