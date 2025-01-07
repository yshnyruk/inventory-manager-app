import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AddItemScreen from '../screens/AddItemScreen';
import HomeScreen from '../screens/HomeScreen';

export type HomeStackParamList = {
  Home: { parentId?: string };
  ItemDetails: { id: string };
  AddItem: { parentId?: string };
};

const HomeStack = createStackNavigator<HomeStackParamList>();

export default function HomeStackNavigation() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name='Home'
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name='AddItem'
        component={AddItemScreen}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}
