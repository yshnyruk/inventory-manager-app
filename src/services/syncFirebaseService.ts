import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, get, set } from 'firebase/database';
import { auth, db } from './firebase';
import { Alert } from 'react-native';
import { Item, Space } from '../screens/HomeScreen';
import { deepCompare } from './deepCompare';

interface Data {
  spaces: Space[];
  items: Item[];
}

export const fetchDataFromFirebase = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User is not authenticated');
  }

  const spacesRef = ref(db, `users/${user.uid}/spaces`);
  const itemsRef = ref(db, `users/${user.uid}/items`);

  const [spacesSnapshot, itemsSnapshot] = await Promise.all([
    get(spacesRef),
    get(itemsRef),
  ]);

  return {
    spaces: spacesSnapshot.exists() ? spacesSnapshot.val() : [],
    items: itemsSnapshot.exists() ? itemsSnapshot.val() : [],
  };
};

export const fetchLocalData = async () => {
  const spaces = await AsyncStorage.getItem('spaces');
  const items = await AsyncStorage.getItem('items');

  return {
    spaces: spaces ? JSON.parse(spaces) : [],
    items: items ? JSON.parse(items) : [],
  };
};

const areDataEqual = (localData: Data, firebaseData: Data): boolean => {
  const areSame = deepCompare(localData, firebaseData);
  console.log('Are data structures identical?', areSame);

  return areSame;
};

export const syncData = async () => {
  try {
    const firebaseData = await fetchDataFromFirebase();
    const localData = await fetchLocalData();

    if (areDataEqual(localData, firebaseData)) {
      console.log('Data are equal');
      return;
    }

    const userChoice = await new Promise((resolve) => {
      Alert.alert(
        'Data Conflict',
        'Your local data and Firebase data do not match. What would you like to do?',
        [
          {
            text: 'Update Firebase Data',
            onPress: () => resolve('updateFirebase'),
          },
          { text: 'Update Local Data', onPress: () => resolve('updateLocal') },
          { text: 'Merge Data', onPress: () => resolve('merge') },
        ]
      );
    });

    if (userChoice === 'updateFirebase') {
      const user = auth.currentUser;
      if (user) {
        const spacesRef = ref(db, `users/${user.uid}/spaces`);
        const itemsRef = ref(db, `users/${user.uid}/items`);

        await Promise.all([
          set(spacesRef, localData.spaces),
          set(itemsRef, localData.items),
        ]);

        alert('Firebase data updated successfully.');
      }
    } else if (userChoice === 'updateLocal') {
      await AsyncStorage.setItem('spaces', JSON.stringify(firebaseData.spaces));
      await AsyncStorage.setItem('items', JSON.stringify(firebaseData.items));

      alert('Local data updated successfully.');
    } else if (userChoice === 'merge') {
      const mergeUniqueObjects = (array1: [], array2: []) => {
        const combined = [...array1, ...array2];
        return combined.filter(
          (item: any, index, self) =>
            index === self.findIndex((t: any) => t.id === item.id)
        );
      };

      const mergedSpaces = mergeUniqueObjects(
        localData.spaces,
        firebaseData.spaces
      );
      const mergedItems = mergeUniqueObjects(
        localData.items,
        firebaseData.items
      );

      await AsyncStorage.setItem('spaces', JSON.stringify(mergedSpaces));
      await AsyncStorage.setItem('items', JSON.stringify(mergedItems));

      const user = auth.currentUser;
      if (user) {
        const spacesRef = ref(db, `users/${user.uid}/spaces`);
        const itemsRef = ref(db, `users/${user.uid}/items`);

        await Promise.all([
          set(spacesRef, mergedSpaces),
          set(itemsRef, mergedItems),
        ]);
      }

      alert('Data merged and synchronized successfully.');
    }
  } catch (error) {
    console.error('Error syncing data:', error);
    alert('Failed to synchronize data.');
  }
};

export const uploadDataToFirebase = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User is not authenticated');
    }

    const spaces = await AsyncStorage.getItem('spaces');
    const items = await AsyncStorage.getItem('items');

    const spacesData = spaces ? JSON.parse(spaces) : [];
    const itemsData = items ? JSON.parse(items) : [];

    const userRef = ref(db, `users/${user.uid}`);
    await set(userRef, {
      spaces: spacesData,
      items: itemsData,
      updatedAt: new Date().toISOString(),
    });

    console.log('Data successfully uploaded to Firebase!');
    alert('Data uploaded successfully!');
  } catch (error) {
    console.error('Error uploading data to Firebase:', (error as any).message);
    alert('Failed to upload data. Please try again.');
  }
};
