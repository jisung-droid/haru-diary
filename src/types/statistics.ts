export interface DiaryStatistics {
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  entriesPerWeek: Record<string, number>;
  entriesPerMonth: Record<string, number>;
  moodDistribution: Record<string, number>;
  stickerRanking: { emoji: string; count: number }[];
  plantStage: number;
}
