import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

if (!admin.apps.length) {
  admin.initializeApp();
}

const SPEECH_API_URL = 'https://speech.googleapis.com/v1/speech:recognize';

export const sttTranscribe = functions.https.onCall(async (request) => {
  const { audioPath } = request.data as { audioPath: string };

  if (!audioPath) {
    throw new functions.https.HttpsError('invalid-argument', 'Audio path is required');
  }

  // Verify the caller is authenticated
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  // Get the API key from Firebase config
  const apiKey = functions.config().google?.stt_api_key;
  if (!apiKey) {
    throw new functions.https.HttpsError('internal', 'STT API key not configured');
  }

  // Download audio from Storage
  const bucket = admin.storage().bucket();
  const file = bucket.file(audioPath);
  const [audioBuffer] = await file.download();
  const audioContent = audioBuffer.toString('base64');

  // Call Google Cloud Speech-to-Text
  const response = await fetch(`${SPEECH_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      config: {
        encoding: 'MP4',
        sampleRateHertz: 44100,
        languageCode: 'ko-KR',
        alternativeLanguageCodes: ['en-US'],
        enableAutomaticPunctuation: true,
      },
      audio: { content: audioContent },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new functions.https.HttpsError('internal', `STT API error: ${error}`);
  }

  const data = (await response.json()) as {
    results?: { alternatives?: { transcript: string }[] }[];
  };

  const transcript =
    data.results
      ?.map((r) => r.alternatives?.[0]?.transcript || '')
      .join(' ')
      .trim() || '';

  return { transcript };
});
