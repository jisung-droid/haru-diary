import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import NaverLogin from '@react-native-seoul/naver-login';
import functions from '@react-native-firebase/functions';

GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID', // Replace with Firebase web client ID
});

const naverLoginConfig = {
  consumerKey: 'YOUR_NAVER_CONSUMER_KEY',
  consumerSecret: 'YOUR_NAVER_CONSUMER_SECRET',
  appName: 'Daily Diary',
  serviceUrlSchemeIOS: 'dailydiary',
};

export async function signInWithGoogle() {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();
  if (!response.data?.idToken) {
    throw new Error('Google Sign-In failed: no idToken');
  }
  const googleCredential = auth.GoogleAuthProvider.credential(response.data.idToken);
  return auth().signInWithCredential(googleCredential);
}

export async function signInWithNaver() {
  const result = await NaverLogin.login(naverLoginConfig);
  if (!result.successResponse) {
    throw new Error('Naver login failed');
  }
  const { accessToken } = result.successResponse;
  const naverAuth = functions().httpsCallable('naverAuth');
  const response = await naverAuth({ accessToken });
  const { customToken } = response.data as { customToken: string };
  return auth().signInWithCustomToken(customToken);
}

export async function signOut() {
  try {
    await GoogleSignin.signOut();
  } catch {}
  try {
    NaverLogin.logout();
  } catch {}
  return auth().signOut();
}

export function onAuthStateChanged(callback: (user: any) => void) {
  return auth().onAuthStateChanged(callback);
}

export function getCurrentUser() {
  return auth().currentUser;
}
