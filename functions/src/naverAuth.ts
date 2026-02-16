import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

if (!admin.apps.length) {
  admin.initializeApp();
}

interface NaverProfile {
  id: string;
  email?: string;
  name?: string;
  profile_image?: string;
}

export const naverAuth = functions.https.onCall(async (request) => {
  const { accessToken } = request.data as { accessToken: string };

  if (!accessToken) {
    throw new functions.https.HttpsError('invalid-argument', 'Access token is required');
  }

  // Verify Naver token and get profile
  const profileResponse = await fetch('https://openapi.naver.com/v1/nid/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!profileResponse.ok) {
    throw new functions.https.HttpsError('unauthenticated', 'Invalid Naver access token');
  }

  const profileData = (await profileResponse.json()) as { response: NaverProfile };
  const profile = profileData.response;

  // Create or update Firebase user
  const uid = `naver:${profile.id}`;
  try {
    await admin.auth().getUser(uid);
    // User exists, update
    await admin.auth().updateUser(uid, {
      displayName: profile.name,
      photoURL: profile.profile_image,
    });
  } catch {
    // User doesn't exist, create
    await admin.auth().createUser({
      uid,
      email: profile.email,
      displayName: profile.name,
      photoURL: profile.profile_image,
    });
  }

  // Create custom token
  const customToken = await admin.auth().createCustomToken(uid);
  return { customToken };
});
