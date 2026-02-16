export const AUDIO_CONFIG = {
  EXPIRY_DAYS: 3,
  MAX_RECORDING_DURATION_MS: 5 * 60 * 1000, // 5 minutes
  RECORDING_OPTIONS: {
    isMeteringEnabled: true,
    android: {
      extension: '.m4a',
      outputFormat: 'mpeg4' as const,
      audioEncoder: 'aac' as const,
      sampleRate: 44100,
      numberOfChannels: 1,
      bitRate: 128000,
    },
    ios: {
      extension: '.m4a',
      outputFormat: 'mpeg4' as const,
      audioQuality: 'high' as const,
      sampleRate: 44100,
      numberOfChannels: 1,
      bitRate: 128000,
    },
  },
} as const;
