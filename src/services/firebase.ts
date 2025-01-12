import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth/react-native';
import { getDatabase } from 'firebase/database';
// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCHQa5WoYMmJex2HD5Pyn2-2EcP1sSpuJ4',
  authDomain: 'inventory-manager-app-a35f9.firebaseapp.com',
  databaseURL:
    'https://inventory-manager-app-a35f9-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'inventory-manager-app-a35f9',
  storageBucket: 'inventory-manager-app-a35f9.firebasestorage.app',
  messagingSenderId: '799397980833',
  appId: '1:799397980833:web:ae95aed427a461cd49dee0',
  measurementId: 'G-GRGZJ2CYEF',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Export database
export const db = getDatabase(app);
