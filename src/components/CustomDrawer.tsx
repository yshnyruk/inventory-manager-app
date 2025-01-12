import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { COLORS } from '../styles';
import DrawerButton from './DrawerButton';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../services/authService';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { user } = useAuth();

  return (
    <DrawerContentScrollView contentContainerStyle={styles.drawerContainer}>
      <View style={styles.userGreeting}>
        <Text style={styles.greetingText}>
          Hello, {user ? user.displayName : 'User'} :)
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
      {user ? (
        <DrawerButton label='Log Out' onPress={() => logoutUser()} />
      ) : (
        <DrawerButton
          label='Log In'
          iconName='user'
          onPress={() => props.navigation.navigate('LoginStack')}
        />
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
