import { useState, useRef } from 'react';
import { useAudioRecorder, AudioModule, RecordingPresets } from 'expo-audio';

export function useAudioRecording() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = async () => {
    const status = await AudioModule.requestRecordingPermissionsAsync();
    if (!status.granted) {
      throw new Error('Microphone permission not granted');
    }

    setRecordingUri(null);
    setDurationMs(0);
    recorder.record();
    setIsRecording(true);

    intervalRef.current = setInterval(() => {
      setDurationMs((prev) => prev + 1000);
    }, 1000);
  };

  const stopRecording = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    await recorder.stop();
    setIsRecording(false);
    setRecordingUri(recorder.uri);
    return { uri: recorder.uri, durationMs };
  };

  const resetRecording = () => {
    setRecordingUri(null);
    setDurationMs(0);
  };

  return {
    isRecording,
    recordingUri,
    durationMs,
    startRecording,
    stopRecording,
    resetRecording,
  };
}
