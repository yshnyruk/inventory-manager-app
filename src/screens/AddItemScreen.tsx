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
import { getData, setData } from '../services';
import AddItemForm from '../components/AddItemForm';
import { Item } from './HomeScreen';
import * as ImagePicker from 'expo-image-picker';
import { ref, set } from 'firebase/database';
import { db } from '../services/firebase';
import { AuthContext } from '../contexts/AuthContext';

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
    expiryDate: null,
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
    const currentItems = await getData('items');
    if (existingItem) {
      const updatedItems = currentItems.map((item: Item) =>
        item.id === formData.id ? formData : item
      );
      console.log('Edited in AsyncStorage:', formData);
      console.log('User:', user);
      await setData('items', updatedItems);
      if (null !== user) {
        const itemsRef = ref(db, `users/${user.uid}/items`);
        set(itemsRef, updatedItems);
        console.log('Edited in firebase:', formData);
      }
    } else {
      await setData('items', [...currentItems, formData]);
      console.log('Added to AsyncStorage:', formData);
      console.log('User:', user);
      if (null !== user) {
        const itemsRef = ref(db, `users/${user.uid}/items`);
        set(itemsRef, [...currentItems, formData]);
        console.log('Added to firebase:', formData);
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
      <Header
        label={existingItem ? `Editing ${existingItem.name}` : 'Add item'}
        navigation={navigation}
      />
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
    backgroundColor: COLORS['dark-green'],
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 24,
    color: COLORS['dark-text-green'],
  },
});
export default AddItemScreen;
