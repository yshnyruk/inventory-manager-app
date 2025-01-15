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
  dataLoaded: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  dataLoaded: false,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const checkUser = onAuthStateChanged(auth, (user) => {
      console.log('onAuthStateChanged callback:', user?.email);
      setUser(user);
      if (null !== user) {
        setDataLoaded(false);
        syncData().then(() => {
          console.log('Data synced');
          setDataLoaded(true);
        });
      }
    });

    return () => {
      console.log('Cleanup...');
      checkUser();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, dataLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};
