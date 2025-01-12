import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { LoginStackParamList } from '../navigation/stack/LoginStackNavigation';
import React, { useState } from 'react';
import { COLORS } from '../styles/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import { registerUser } from '../services/authService';

type RegisterScreenProps = StackScreenProps<LoginStackParamList, 'Register'>;

const RegisterScreen = ({ route, navigation }: RegisterScreenProps) => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');

  const handleBack = () => {
    navigation.goBack();
    console.log('Back');
  };

  const handleCreateAccount = async () => {
    const user = await registerUser(nickname, email, password, checkPassword);

    if (user) {
      navigation.goBack();
      console.log('Create account');
    }
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
        <TextInput
          value={nickname}
          onChangeText={setNickname}
          style={styles.input}
          placeholder='Nickname'
        />
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
        <TextInput
          value={checkPassword}
          onChangeText={setCheckPassword}
          style={styles.input}
          secureTextEntry={true}
          placeholder='Re-enter password'
        />
        <TouchableOpacity onPress={handleCreateAccount} style={styles.button}>
          <Text style={styles.textButton}>Create account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;

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
