import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsButton from '../components/SettingsButton';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsStackParamList } from '../navigation/stack/SettingsStackNavigation';
import { uploadDataToFirebase } from '../services/syncFirebaseService';

type Props = StackScreenProps<SettingsStackParamList, 'Settings'>;

const SettingsScreen = ({ navigation }: Props) => {
  const handleReset = async () => {
    await AsyncStorage.clear();
    console.log('All data cleared!');
  };

  const handleSync = async () => {
    await uploadDataToFirebase();
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} label='Settings' />
      {/* Main Content */}
      <View style={styles.content}>
        <SettingsButton
          title='Reminders'
          icon='bell'
          onPress={() => navigation.navigate('Reminders')}
        />

        {/* Sync Data to Firebase button */}
        <TouchableOpacity onPress={handleSync} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Sync to Account</Text>
        </TouchableOpacity>

        {/* Reset Data button */}
        <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Reset Data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 24,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  resetButton: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  resetButtonText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
});

export default SettingsScreen;
