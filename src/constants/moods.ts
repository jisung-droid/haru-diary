export const DEFAULT_MOODS = ['great', 'good', 'okay', 'bad', 'terrible'] as const;

export const MOOD_COLORS: Record<string, string> = {
  great: '#4CAF50',
  good: '#8BC34A',
  okay: '#FFC107',
  bad: '#FF9800',
  terrible: '#F44336',
};

export const MOOD_EMOJIS: Record<string, string> = {
  great: '😄',
  good: '🙂',
  okay: '😐',
  bad: '😟',
  terrible: '😢',
};
