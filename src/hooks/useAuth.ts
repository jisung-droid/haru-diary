import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { signInWithGoogle, signInWithNaver, signOut as authSignOut } from '../services/authService';

export function useAuth() {
  const { user, loading, error, setError } = useAuthContext();
  const [signingIn, setSigningIn] = useState(false);

  const loginWithGoogle = async () => {
    setSigningIn(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setSigningIn(false);
    }
  };

  const loginWithNaver = async () => {
    setSigningIn(true);
    setError(null);
    try {
      await signInWithNaver();
    } catch (err: any) {
      setError(err.message || 'Naver sign-in failed');
    } finally {
      setSigningIn(false);
    }
  };

  const signOut = async () => {
    try {
      await authSignOut();
    } catch (err: any) {
      setError(err.message || 'Sign out failed');
    }
  };

  return {
    user,
    loading,
    error,
    signingIn,
    loginWithGoogle,
    loginWithNaver,
    signOut,
  };
}
