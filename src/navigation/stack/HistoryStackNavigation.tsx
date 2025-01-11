import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import HistoryScreen from '../../screens/HistoryScreen';
import ItemDetailsScreen from '../../screens/ItemDetailsScreen';

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
        options={{
          headerShown: false,
          ...TransitionPresets.ModalFadeTransition,
        }}
      />
      <HistoryStack.Screen
        name='HistoryItem'
        component={ItemDetailsScreen}
        options={{ headerShown: false }}
      />
    </HistoryStack.Navigator>
  );
}
