# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Haru Diary is a React Native mobile diary app built with Expo (bare workflow). It uses Firebase as its backend (Firestore, Auth, Storage, Cloud Functions). The app targets iOS and Android and supports Korean and English content.

## Commands

### Mobile App (root)
```bash
npx expo start              # Start Expo dev server (Metro only, not Expo Go compatible)
npx expo run:ios            # Build and run on iOS simulator
npx expo run:ios --device   # Build and install on a connected iPhone
npx expo run:android        # Build and run on Android emulator/device
```

The `ios/` and `android/` directories are gitignored but can be regenerated:
```bash
npx expo prebuild           # Regenerate native directories from app.json + plugins
cd ios && pod install       # Re-install CocoaPods after prebuild
```

### Cloud Functions (`functions/`)
```bash
cd functions
npm run build           # Compile TypeScript
npm run serve           # Build + start Firebase emulators (functions only)
npm run deploy          # Deploy to Firebase
firebase deploy --only firestore:rules   # Deploy Firestore rules
```

## Architecture

### Routing (Expo Router / file-based)
- `app/_layout.tsx` — Root layout; wraps everything in `ErrorBoundary`, `AuthProvider`, `UserPreferencesProvider`. Handles auth-based redirects: unauthenticated → `/(auth)/login`, authenticated → `/(tabs)`.
- `app/(auth)/login.tsx` — Login screen
- `app/(tabs)/` — Main tab navigation (Timeline, Search, Favorites, Calendar, Settings). `statistics` tab exists but has `href: null` (hidden, accessed programmatically).
- `app/entry/[id].tsx` — View/edit an existing diary entry
- `app/entry/new.tsx` — Create a new diary entry

### State & Data Flow
- **Contexts** (`src/contexts/`): `AuthContext` (Firebase auth state) and `UserPreferencesContext` (Firestore-backed user preferences like streak, plant stage). Both are initialized at the root layout.
- **Hooks** (`src/hooks/`): Thin wrappers over services. Hooks subscribe to Firestore real-time listeners (e.g., `useDiaryEntries`, `useFavoriteEntries`, `useCalendarEntries`) and expose loading/error states to screens.
- **Services** (`src/services/`): All Firebase interactions. Screens never call Firebase directly — they go through services.
  - `diaryService.ts` — CRUD + Firestore subscriptions for `diaryEntries` collection
  - `storageService.ts` — Upload/delete audio (`audio/{userId}/{entryId}.m4a`) and images (`images/{userId}/{entryId}_{index}.jpg`) in Firebase Storage
  - `authService.ts` — Google Sign-In, Naver Sign-In (via Cloud Function custom token), sign-out
  - `sttService.ts` — Calls the `sttTranscribe` Cloud Function
  - `userPreferencesService.ts` — Streak, plant stage, total entries stored at `users/{userId}/preferences/main`

### Cloud Functions (`functions/src/`)
- `naverAuth` — Verifies a Naver OAuth access token, creates/updates a Firebase user, and returns a custom token for `signInWithCustomToken`.
- `sttTranscribe` — Downloads audio from Firebase Storage, calls Google Cloud Speech-to-Text API (Korean primary, English alternative), returns transcript. Requires `google.stt_api_key` set via `firebase functions:config:set`.
- `audioCleanup` — Scheduled cleanup of expired audio files (TTL tracked via `audioExpiresAt` field on entries).

### Key Data Model
`DiaryEntry` (Firestore collection: `diaryEntries`):
- `entryDate: string` — `'YYYY-MM-DD'` format, used as primary query key
- `audioUrl / audioPath / audioExpiresAt` — Audio stored in Firebase Storage with TTL managed by `audioCleanup` function
- `sttText` — Populated after calling `sttTranscribe`
- `imageUrls / imagePaths` — Parallel arrays of download URLs and storage paths
- `mood`, `stickers`, `checklistItems`, `isFavorite` — Rich diary metadata

`UserPreferences` (Firestore: `users/{uid}/preferences/main`):
- Tracks `currentStreak`, `longestStreak`, `lastEntryDate`, `totalEntries`, `plantStage`
- Plant stage (0–N) is derived from streak length via `src/utils/streakUtils.ts`

### Firestore Security Rules
Users can only read/write their own `diaryEntries` (matched by `userId` field) and their own preferences subcollection. See `firebase/firestore.rules`.

## Firebase Configuration
- iOS: `firebase/GoogleService-Info.plist`
- Android: `firebase/google-services.json`
- Auth credentials in `src/services/authService.ts` have placeholder values that must be replaced:
  - `YOUR_WEB_CLIENT_ID` → OAuth 2.0 Web Client ID from Firebase console → Authentication → Sign-in method → Google
  - `YOUR_NAVER_CONSUMER_KEY` / `YOUR_NAVER_CONSUMER_SECRET` → Naver Developers console

### Cloud Function config (STT)
```bash
firebase functions:config:set google.stt_api_key="YOUR_GOOGLE_STT_API_KEY"
```

## Important Notes
- **No Expo Go**: the app uses `@react-native-firebase` native modules; it must be run via `expo run:ios` / `expo run:android`, not Expo Go.
- **Safe area**: entry screens use `useSafeAreaInsets()` for the header — avoid hardcoding `paddingTop`.
