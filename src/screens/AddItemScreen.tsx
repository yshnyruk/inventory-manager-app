import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeStackParamList } from '../navigation/stack/HomeStackNavigation';
import { COLORS } from '../styles';
import Header from '../components/Header';
import AddItemForm from '../components/AddItemForm';
import { Item } from './HomeScreen';
import * as ImagePicker from 'expo-image-picker';
import { ref, set } from 'firebase/database';
import { db } from '../services/firebaseService';
import { AuthContext } from '../contexts/AuthContext';
import { getFromStorage, saveToStorage } from '../services/storageService';

type AddItemScreenProps = StackScreenProps<HomeStackParamList, 'AddItem'>;

const AddItemScreen = ({ navigation, route }: AddItemScreenProps) => {
  const [formData, setFormData] = useState<Item>({
    id: Date.now().toString(),
    name: '',
    number: 1,
    activeFrom: new Date().toISOString(),
    activeTo: null,
    parentId: route.params.parentId || '',
    emoji: '',
    photoUri: '',
  });
  const existingItem = route.params?.item;
  const { user } = useContext(AuthContext);

  const selectPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
    });

    if (result.assets && result.assets.length > 0) {
      setFormData({ ...formData, photoUri: result.assets[0].uri });
    }
  };

  const handleAddItem = async () => {
    const currentItems = await getFromStorage('items');
    if (existingItem) {
      const updatedItems = currentItems.map((item: Item) =>
        item.id === formData.id ? formData : item
      );
      await saveToStorage('items', updatedItems);
      if (user) {
        const itemsRef = ref(db, `users/${user.uid}/items`);
        set(itemsRef, updatedItems);
        console.log('formdata:', formData);
      }
    } else {
      await saveToStorage('items', [...currentItems, formData]);
      if (user) {
        const itemsRef = ref(db, `users/${user.uid}/items`);
        set(itemsRef, [...currentItems, formData]);
        console.log('formdata:', formData);
      }
    }

    navigation.goBack();
  };

  useEffect(() => {
    if (existingItem) {
      setFormData(existingItem);
      console.log('Existing item:', existingItem);
    }
  }, []);

  return (
    <View>
      <Header label='Add Item' navigation={navigation} />
      <AddItemForm
        formData={formData}
        setFormData={setFormData}
        onSelectPhoto={selectPhoto}
      />
      <TouchableOpacity style={styles.button} onPress={() => handleAddItem()}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: COLORS['dark-green'],
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 24,
    color: COLORS['dark-text-green'],
  },
});
export default AddItemScreen;
