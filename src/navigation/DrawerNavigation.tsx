import React from 'react';
import { createStaticNavigation, NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import HistoryScreen from '../screens/HistoryScreen';

export type RootDrawerParamList = {
  Home: undefined;
  Settings: undefined;
  History: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      <View style={styles.userGreeting}>
        <Text style={styles.greetingText}>Hello, User :{')'}</Text>
      </View>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('History')}
        style={styles.drawerItem}
      >
        <Text style={styles.drawerItemText}>History</Text>
      </TouchableOpacity>
      <View style={{ flex: 1 }} />
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Settings')}
        style={styles.drawerItem}
      >
        <Text style={styles.drawerItemText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerItem}>
        <Text style={styles.drawerItemText}>Log In</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const DrawerNavigation = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName='Home'
        screenOptions={{ headerShown: false }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name='Home'
          component={HomeScreen}
          options={{ drawerItemStyle: { display: 'none' } }}
        />
        <Drawer.Screen name='Settings' component={SettingsScreen} />
        <Drawer.Screen name='History' component={HistoryScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  drawerContainer: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingTop: 24,
    backgroundColor: '#f8f8f8',
  },
  userGreeting: {
    padding: 10,
  },
  greetingText: {
    fontSize: 18,
    color: '#333',
  },
  drawerItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'grey',
  },
  drawerItemText: {
    fontSize: 18,
    color: '#333',
  },
});

export default DrawerNavigation;
