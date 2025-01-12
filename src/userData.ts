import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserData {
  id: string;
  name: string;
  email: string;
}

const USER_DATA_KEY = 'userData';

export async function setUserData(userData: UserData): Promise<void> {
  try {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem(USER_DATA_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving user data', e);
  }
}

export async function getUserData(): Promise<UserData | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_DATA_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error retrieving user data', e);
    return null;
  }
}

export async function removeUserData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
  } catch (e) {
    console.error('Error removing user data', e);
  }
}
