import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './src/navigation/StackNavigation';
import { SQLiteProvider } from 'expo-sqlite';
import { initDatabase } from './db';

// Define Stack Navigation
function App() {
  return (
    <SQLiteProvider databaseName='add.db' onInit={initDatabase}>
      <StackNavigation />
    </SQLiteProvider>
  );
}

export default App;
