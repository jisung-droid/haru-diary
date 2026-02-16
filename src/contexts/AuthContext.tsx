import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from '../services/authService';
import { AuthUser, AuthState } from '../types/auth';

interface AuthContextValue extends AuthState {
  setError: (error: string | null) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  error: null,
  setError: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const user: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          providerId: firebaseUser.providerData[0]?.providerId || 'unknown',
        };
        setState({ user, loading: false, error: null });
      } else {
        setState({ user: null, loading: false, error: null });
      }
    });
    return unsubscribe;
  }, []);

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  };

  return (
    <AuthContext.Provider value={{ ...state, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}

export default AuthContext;
