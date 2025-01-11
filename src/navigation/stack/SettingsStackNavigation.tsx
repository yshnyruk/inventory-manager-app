import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../../screens/SettingsScreen';
import RemindersScreen from '../../screens/RemindersScreen';

export type SettingsStackParamList = {
  Settings: undefined;
  Reminders: undefined;
};

const SettingsStack = createStackNavigator<SettingsStackParamList>();

const SettingsStackNavigation = () => {
  return (
    <SettingsStack.Navigator initialRouteName='Settings'>
      <SettingsStack.Screen
        name='Settings'
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <SettingsStack.Screen
        name='Reminders'
        component={RemindersScreen}
        options={{ headerShown: false }}
      />
    </SettingsStack.Navigator>
  );
};

export default SettingsStackNavigation;
