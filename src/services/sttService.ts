import functions from '@react-native-firebase/functions';

export async function transcribeAudio(audioPath: string): Promise<string> {
  const sttTranscribe = functions().httpsCallable('sttTranscribe');
  const response = await sttTranscribe({ audioPath });
  const { transcript } = response.data as { transcript: string };
  return transcript;
}
