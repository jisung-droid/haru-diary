import { AUDIO_CONFIG } from '../constants/audio';

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function isAudioExpired(expiresAt: { toDate: () => Date } | null): boolean {
  if (!expiresAt) return false;
  return new Date() > expiresAt.toDate();
}

export function getAudioExpiryDate(createdAt: Date): Date {
  const expiry = new Date(createdAt);
  expiry.setDate(expiry.getDate() + AUDIO_CONFIG.EXPIRY_DAYS);
  return expiry;
}
