import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { LoginStackParamList } from '../navigation/stack/LoginStackNavigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../styles/theme';
import { TextInput } from 'react-native-gesture-handler';
import { loginUser } from '../services/authService';

type LoginScreenProps = StackScreenProps<LoginStackParamList, 'Login'>;

const LoginScreen = ({ route, navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleBack = () => {
    navigation.goBack();

    // Clear email and password
    setEmail('');
    setPassword('');

    console.log('Back');
  };

  const handleLogin = async () => {
    const user = loginUser(email, password);
    if (null === user) {
      return;
    }

    navigation.goBack();
    // Clear email and password
    setEmail('');
    setPassword('');

    console.log('Login');
  };

  const handleCreateAccount = () => {
    // Clear email and password
    setEmail('');
    setPassword('');

    // Navigate to Register screen
    navigation.navigate('Register');
    console.log('Create account');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name='chevron-left' size={24} color={COLORS['input-stroke']} />
        </TouchableOpacity>
      </View>

      {/* Main */}
      <View style={styles.contentContainer}>
        <Text style={styles.logo}>INVENTORY MANAGER</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder='Email'
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry={true}
          placeholder='Password'
        />
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.textButton}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCreateAccount}
          style={{ opacity: 0.3 }}
        >
          <Text>Create account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContent: {
    flexDirection: 'row',
    height: 96,
    alignItems: 'flex-end',
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    textAlign: 'center',
    backgroundColor: COLORS['dark-green'],
    color: COLORS.white,
    borderRadius: 12,
    fontSize: 36,
    fontWeight: 'bold',
    padding: 12,
    position: 'absolute',
    top: Dimensions.get('window').height / 8,
  },
  input: {
    width: Dimensions.get('window').width / 1.5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS['input-stroke'],
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: COLORS['dark-green'],
    padding: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
  },
  textButton: {
    color: COLORS['dark-text-green'],
    fontWeight: 'bold',
  },
});
