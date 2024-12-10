import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigation from './DrawerNavigation';
import AddItemScreen from '../screens/AddItemScreen';

const Stack = createStackNavigator();

export default function StackNavigation() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen 
            name='Root' 
            component={DrawerNavigation}
            options={{headerShown: false}}/>
            <Stack.Screen
            name='AddItemScreen'
            component={AddItemScreen}
            options={{headerShown: false}}/>
        </Stack.Navigator>
    </NavigationContainer>
  )
}