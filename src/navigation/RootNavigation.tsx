import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SettingsScreen from '../screens/SettingsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import CustomDrawerContent from '../components/CustomDrawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeStackNavigation, {
  HomeStackParamList,
} from './stack/HomeStackNavigation';

export type RootDrawerParamList = {
  HomeStack: undefined;
  Settings: undefined;
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
        <RootDrawer.Screen name='Settings' component={SettingsScreen} />
        <RootDrawer.Screen name='History' component={HistoryScreen} />
      </RootDrawer.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
