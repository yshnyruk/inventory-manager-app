import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Button, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import HomeScreen from './screens/HomeScreen';  // Assuming you have HomeScreen component
import DrawerScreen from './screens/DrawerScreen';  // Assuming you have DrawerScreen component

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Define Drawer Menu
function DrawerMenu() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="DrawerScreen" component={DrawerScreen} />
    </Drawer.Navigator>
  );
}

// Define Stack Navigation
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="DrawerMenu" component={DrawerMenu} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
