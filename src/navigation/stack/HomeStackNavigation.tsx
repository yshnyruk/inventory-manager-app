import React from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import AddItemScreen from '../../screens/AddItemScreen';
import HomeScreen, { Item } from '../../screens/HomeScreen';
import ItemDetailsScreen from '../../screens/ItemDetailsScreen';

export type HomeStackParamList = {
  Home: { parentId?: string };
  AddItem: { parentId?: string; item?: Item };
  ItemDetails: { parentId: string };
};

const HomeStack = createStackNavigator<HomeStackParamList>();

export default function HomeStackNavigation() {
  return (
    <HomeStack.Navigator initialRouteName='Home'>
      <HomeStack.Screen
        name='Home'
        component={HomeScreen}
        options={{
          headerShown: false,
          ...TransitionPresets.ModalFadeTransition,
        }}
      />
      <HomeStack.Screen
        name='AddItem'
        component={AddItemScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name='ItemDetails'
        component={ItemDetailsScreen}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}
