import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeStackParamList } from '../navigation/stack/HomeStackNavigation';
import { COLORS } from '../styles';
import Header from '../components/Header';
import { getData, setData } from '../services';
import AddItemForm from '../components/AddItemForm';
import { Item } from './HomeScreen';
import * as ImagePicker from 'expo-image-picker';

type AddItemScreenProps = StackScreenProps<HomeStackParamList, 'AddItem'>;

const AddItemScreen = ({ navigation, route }: AddItemScreenProps) => {
  const existingItem = route.params?.item;
  const selectPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
    });

    if (result.assets && result.assets.length > 0) {
      setFormData({ ...formData, photoUri: result.assets[0].uri });
    }
  };

  const [formData, setFormData] = useState(
    () =>
      existingItem || {
        id: new Date().toISOString(),
        name: '',
        number: 1,
        expiryDate: '',
        weightVolume: '',
        additionalInf: '',
        activeFrom: new Date(),
        parentId: route.params?.parentId || 'Root',
        photoUri: '',
      }
  );

  // Function to handle adding a new item
  const handleAddItem = async () => {
    const currentItems = await getData('items');
    if (existingItem) {
      const updatedItems = currentItems.map((item: Item) =>
        item.id === formData.id ? formData : item
      );
      await setData('items', updatedItems);
    } else {
      await setData('items', [...currentItems, formData]);
    }

    navigation.goBack();
  };

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
