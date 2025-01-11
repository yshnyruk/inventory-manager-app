import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SettingsScreen from '../screens/SettingsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import CustomDrawerContent from '../components/CustomDrawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeStackNavigation from './stack/HomeStackNavigation';
import HistoryStackNavigation from './stack/HistoryStackNavigation';
import SettingsStackNavigation from './stack/SettingsStackNavigation';

export type RootDrawerParamList = {
  HomeStack: undefined;
  SettingsStack: undefined;
  History: undefined;
};

const RootDrawer = createDrawerNavigator<RootDrawerParamList>();

const RootNavigation = () => {
  return (
    <NavigationContainer>
      <RootDrawer.Navigator
        initialRouteName='HomeStack'
        screenOptions={{ headerShown: false }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <RootDrawer.Screen name='HomeStack' component={HomeStackNavigation} />
        <RootDrawer.Screen
          name='SettingsStack'
          component={SettingsStackNavigation}
        />
        <RootDrawer.Screen name='History' component={HistoryStackNavigation} />
      </RootDrawer.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
