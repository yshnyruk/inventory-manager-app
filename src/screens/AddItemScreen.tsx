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

type AddItemScreenProps = StackScreenProps<HomeStackParamList, 'AddItem'>;

const AddItemScreen = ({ navigation, route }: AddItemScreenProps) => {
  const existingItem = route.params?.item;

  const [formData, setFormData] = useState(
    () =>
      existingItem || {
        id: new Date().toISOString(),
        name: `Item ${Math.floor(Math.random() * 1000)}`, // Random name
        category: `Category ${Math.floor(Math.random() * 1000)}`, // Random category
        number: Math.floor(Math.random() * 100) + 1, // Random number between 1 and 100
        expiryDate: new Date(
          new Date().setFullYear(
            new Date().getFullYear() + Math.floor(Math.random() * 5)
          )
        ),
        weightVolume: `${Math.floor(Math.random() * 100)} kg`, // Random weight/volume
        additionalInf: `Additional info ${Math.floor(Math.random() * 1000)}`, // Random additional information
        activeFrom: new Date(),
        parentId: route.params?.parentId || 'Root',
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
      <AddItemForm formData={formData} setFormData={setFormData} />
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
