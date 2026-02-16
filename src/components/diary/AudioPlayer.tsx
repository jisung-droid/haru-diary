import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAudioPlayback } from '../../hooks/useAudioPlayback';
import { formatDuration, isAudioExpired } from '../../utils/audioUtils';
import { Colors } from '../../constants/colors';

interface AudioPlayerProps {
  audioUrl: string | null;
  audioExpiresAt: { toDate: () => Date } | null;
  audioDurationMs: number | null;
}

export function AudioPlayer({ audioUrl, audioExpiresAt, audioDurationMs }: AudioPlayerProps) {
  const { isPlaying, position, duration, togglePlayback } = useAudioPlayback(audioUrl);

  if (!audioUrl) return null;

  if (isAudioExpired(audioExpiresAt)) {
    return (
      <View style={styles.container}>
        <Text style={styles.expired}>Audio has expired</Text>
      </View>
    );
  }

  const totalDuration = duration || audioDurationMs || 0;
  const progress = totalDuration > 0 ? (position / totalDuration) * 100 : 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
        <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶️'}</Text>
      </TouchableOpacity>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.time}>
        {formatDuration(position)} / {formatDuration(totalDuration)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  playButton: {
    marginRight: 10,
  },
  playIcon: {
    fontSize: 24,
  },
  progressContainer: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.background,
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  time: {
    fontSize: 12,
    color: Colors.textSecondary,
    minWidth: 70,
    textAlign: 'right',
  },
  expired: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});
