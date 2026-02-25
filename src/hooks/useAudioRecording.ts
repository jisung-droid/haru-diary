import { useState, useRef } from 'react';
import { useAudioRecorder, AudioModule, RecordingPresets } from 'expo-audio';
import { AUDIO_CONFIG } from '../constants/audio';

export function useAudioRecording() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const durationRef = useRef(0);

  const stopRecording = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    await recorder.stop();
    setIsRecording(false);
    setRecordingUri(recorder.uri);
    return { uri: recorder.uri, durationMs: durationRef.current };
  };

  const startRecording = async () => {
    const status = await AudioModule.requestRecordingPermissionsAsync();
    if (!status.granted) {
      throw new Error('Microphone permission not granted');
    }

    setRecordingUri(null);
    setDurationMs(0);
    durationRef.current = 0;
    recorder.record();
    setIsRecording(true);

    intervalRef.current = setInterval(() => {
      durationRef.current += 1000;
      setDurationMs(durationRef.current);
      if (durationRef.current >= AUDIO_CONFIG.MAX_RECORDING_DURATION_MS) {
        stopRecording();
      }
    }, 1000);
  };

  const resetRecording = () => {
    setRecordingUri(null);
    setDurationMs(0);
    durationRef.current = 0;
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
