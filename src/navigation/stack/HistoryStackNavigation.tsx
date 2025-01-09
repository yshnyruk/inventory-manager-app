import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HistoryScreen from '../../screens/HistoryScreen';

export type HistoryStackParamList = {
  HistoryMain: { parentId?: string };
  HistoryItem: { parentId: string };
};

const HistoryStack = createStackNavigator<HistoryStackParamList>();

export default function HistoryStackNavigation() {
  return (
    <HistoryStack.Navigator initialRouteName='HistoryMain'>
      <HistoryStack.Screen
        name='HistoryMain'
        component={HistoryScreen}
        options={{ headerShown: false }}
      />
      {/* <HistoryStack.Screen
        name='HistoryItem'
        component={AddItemScreen}
        options={{ headerShown: false }}
      /> */}
    </HistoryStack.Navigator>
  );
}
