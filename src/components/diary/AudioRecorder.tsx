import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAudioRecording } from '../../hooks/useAudioRecording';
import { formatDuration } from '../../utils/audioUtils';
import { Colors } from '../../constants/colors';

interface AudioRecorderProps {
  onRecorded: (uri: string, durationMs: number) => void;
}

export function AudioRecorder({ onRecorded }: AudioRecorderProps) {
  const { isRecording, recordingUri, durationMs, startRecording, stopRecording, resetRecording } =
    useAudioRecording();

  const handleStop = async () => {
    const result = await stopRecording();
    if (result.uri) {
      onRecorded(result.uri, result.durationMs);
    }
  };

  if (recordingUri) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Audio recorded ({formatDuration(durationMs)})</Text>
        <TouchableOpacity onPress={resetRecording} style={styles.resetButton}>
          <Text style={styles.resetText}>Re-record</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Voice Memo</Text>
      <TouchableOpacity
        style={[styles.recordButton, isRecording && styles.recording]}
        onPress={isRecording ? handleStop : startRecording}
      >
        <Text style={styles.recordIcon}>{isRecording ? '⏹' : '🎤'}</Text>
        <Text style={styles.recordText}>
          {isRecording ? `Recording ${formatDuration(durationMs)}` : 'Tap to record'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recording: {
    borderColor: Colors.error,
    backgroundColor: Colors.error + '10',
  },
  recordIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  recordText: {
    fontSize: 15,
    color: Colors.text,
  },
  resetButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  resetText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});
