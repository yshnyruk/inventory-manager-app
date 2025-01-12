import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { syncData } from '../services/syncFirebaseService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  initializeApp: () => void;
  syncing: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const initializeApp = async () => {
    setSyncing(true);
    if (!user) {
      console.log('initializeApp skipped: No authenticated user');
      setLoading(false);
      return;
    }

    try {
      console.log('initializeApp', user.displayName);
      await syncData();
    } catch (error) {
      console.error('Error syncing data:', error);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      if (user) {
        try {
          console.log('initializeApp', user.displayName);
          initializeApp();
        } catch (error) {
          console.error('Error during initialization:', error);
        }
      } else {
        console.log('No user, skipping initializeApp');
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, initializeApp, syncing }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
