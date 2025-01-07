import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { RootDrawerParamList } from '../navigation/RootNavigation';
import { DrawerScreenProps } from '@react-navigation/drawer';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = DrawerScreenProps<RootDrawerParamList, 'Settings'>;

const SettingsScreen = ({ navigation }: Props) => {
  const handleReset = async () => {
    await AsyncStorage.clear();
    console.log('All data cleared!');
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} label='Settings' />

      {/* Main Content */}
      <View style={styles.content}>
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
