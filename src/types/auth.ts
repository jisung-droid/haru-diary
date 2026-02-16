export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  providerId: string;
}

export type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
};
