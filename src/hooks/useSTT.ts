import { useState } from 'react';
import { transcribeAudio } from '../services/sttService';
import { updateEntry } from '../services/diaryService';

export function useSTT() {
  const [transcribing, setTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transcribe = async (entryId: string, audioPath: string) => {
    setTranscribing(true);
    setError(null);
    try {
      const transcript = await transcribeAudio(audioPath);
      await updateEntry(entryId, { sttText: transcript });
      return transcript;
    } catch (err: any) {
      setError(err.message || 'Transcription failed');
      return null;
    } finally {
      setTranscribing(false);
    }
  };

  return { transcribe, transcribing, error };
}
