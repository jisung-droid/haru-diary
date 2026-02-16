import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserPreferences, DEFAULT_USER_PREFERENCES } from '../types/user';
import { subscribeToPreferences, getUserPreferences } from '../services/userPreferencesService';
import { useAuthContext } from './AuthContext';

interface UserPreferencesContextValue {
  preferences: UserPreferences;
  loading: boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextValue>({
  preferences: DEFAULT_USER_PREFERENCES,
  loading: true,
});

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_USER_PREFERENCES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPreferences(DEFAULT_USER_PREFERENCES);
      setLoading(false);
      return;
    }

    // Initialize preferences if they don't exist
    getUserPreferences(user.uid).catch(() => {});

    const unsubscribe = subscribeToPreferences(user.uid, (prefs) => {
      setPreferences(prefs);
      setLoading(false);
    });

    return unsubscribe;
  }, [user?.uid]);

  return (
    <UserPreferencesContext.Provider value={{ preferences, loading }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferencesContext() {
  return useContext(UserPreferencesContext);
}

export default UserPreferencesContext;
