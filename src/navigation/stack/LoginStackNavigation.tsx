import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../../screens/LoginScreen';
import RegisterScreen from '../../screens/RegisterScreen';

export type LoginStackParamList = {
  Login: undefined;
  Register: undefined;
};

const LoginStack = createStackNavigator<LoginStackParamList>();

export const LoginStackNavigation = () => {
  return (
    <LoginStack.Navigator>
      <LoginStack.Screen
        name='Login'
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <LoginStack.Screen
        name='Register'
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
    </LoginStack.Navigator>
  );
};
