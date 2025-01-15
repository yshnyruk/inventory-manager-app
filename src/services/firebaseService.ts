import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth/react-native';
import {
  child,
  get,
  getDatabase,
  push,
  ref,
  remove,
  set,
  update,
} from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getDatabase(app);

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const syncDataToDatabase = async (path: string, data: any) => {
  try {
    const dbRef = ref(db, path);
    await set(dbRef, data);
    console.log(`Data synced to Realtime Database at path: ${path}`);
  } catch (error) {
    console.error('Error syncing data to Realtime Database:', error);
    throw error;
  }
};

export const fetchDataFromDatabase = async (path: string) => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, path));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log('No data available at path:', path);
      return null;
    }
  } catch (error) {
    console.error('Error fetching data from Realtime Database:', error);
    throw error;
  }
};

export const updateDataInDatabase = async (
  path: string,
  data: any
): Promise<void> => {
  try {
    const dbRef = ref(db, path);
    await update(dbRef, data);
    console.log(`Data updated in Realtime Database at path: ${path}`);
  } catch (error) {
    console.error('Error updating data in Realtime Database:', error);
    throw error;
  }
};

export const removeDataFromDatabase = async (path: string): Promise<void> => {
  try {
    const dbRef = ref(db, path);
    await remove(dbRef);
    console.log(`Data removed from Realtime Database at path: ${path}`);
  } catch (error) {
    console.error('Error removing data from Realtime Database:', error);
    throw error;
  }
};

export const addDataWithAutoId = async (
  path: string,
  data: any
): Promise<string | null> => {
  try {
    const dbRef = ref(db, path);
    const newRef = push(dbRef);
    await set(newRef, data);
    console.log(`Data added to Realtime Database at path: ${path}`);
    return newRef.key;
  } catch (error) {
    console.error(
      'Error adding data with auto ID to Realtime Database:',
      error
    );
    throw error;
  }
};
