import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { COLORS } from '../styles';
import DrawerButton from './DrawerButton';
import { logoutUser } from '../services/authService';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { user } = useContext(AuthContext);

  return (
    <DrawerContentScrollView contentContainerStyle={styles.drawerContainer}>
      <View style={styles.userGreeting}>
        <Text style={styles.greetingText}>
          Hello, {null === user ? 'User' : user.displayName} :)
        </Text>
      </View>
      <DrawerButton
        label='History'
        iconName='history'
        onPress={() => props.navigation.navigate('History')}
      />
      <DrawerButton
        label='Settings'
        iconName='gear'
        onPress={() => props.navigation.navigate('SettingsStack')}
      />
      {null === user ? (
        <DrawerButton
          label='Log In'
          iconName='user'
          onPress={() => props.navigation.navigate('LoginStack')}
        />
      ) : (
        <DrawerButton label='Log out' onPress={() => logoutUser()} />
      )}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  userGreeting: {
    height: 112,
    borderRadius: 12,
    justifyContent: 'flex-end',
    backgroundColor: COLORS['light-green'],
  },
  greetingText: {
    fontSize: 24,
    color: COLORS['dark-text-green'],
    marginBottom: 12,
    marginLeft: 20,
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

export default CustomDrawerContent;
