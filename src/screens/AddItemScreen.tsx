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
import { HomeStackParamList } from '../navigation/HomeStackNavigation';
import { COLORS } from '../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/FontAwesome';

type AddItemScreenProps = StackScreenProps<HomeStackParamList, 'AddItem'>;

const AddItemScreen = ({ navigation, route }: AddItemScreenProps) => {
  const [formData, setFormData] = useState(() => ({
    id: new Date().toISOString(),
    name: `Item ${Math.floor(Math.random() * 1000)}`, // Random name
    category: `Category ${Math.floor(Math.random() * 1000)}`, // Random category
    number: Math.floor(Math.random() * 100) + 1, // Random number between 1 and 100
    expiryDate: new Date(
      new Date().setFullYear(
        new Date().getFullYear() + Math.floor(Math.random() * 5)
      )
    ), // Random expiry date within the next 5 years
    weightVolume: `${Math.floor(Math.random() * 100)} kg`, // Random weight/volume
    additionalInf: `Additional info ${Math.floor(Math.random() * 1000)}`, // Random additional information
    activeFrom: new Date(),
    parentId: route.params?.parentId || 'Root',
  }));

  // Function to handle adding a new item
  const handleAddItem = () => {
    AsyncStorage.getItem('items')
      .then((storedItems) => {
        const currentItems = storedItems ? JSON.parse(storedItems) : [];
        const updatedItems = [...currentItems, formData];

        return AsyncStorage.setItem('items', JSON.stringify(updatedItems));
      })
      .then(() => {
        console.log('Items saved successfully!');
        console.log('Saved item:', formData);
      })
      .catch((error) => {
        console.error('Failed to save items:', error);
      });

    navigation.goBack();
  };

  return (
    <View>
      <Header label='Add Item' navigation={navigation} />
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder='Name'
          value={formData.name} // Display pre-filled value
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder='Category'
          value={formData.category} // Display pre-filled value
          onChangeText={(text) => setFormData({ ...formData, category: text })}
        />
        <TextInput
          style={styles.input}
          placeholder='Number'
          keyboardType='numeric'
          value={formData.number.toString()} // Display pre-filled value
          onChangeText={(text) =>
            setFormData({ ...formData, number: parseInt(text, 10) })
          }
        />
        <TextInput
          style={styles.input}
          placeholder='Date of Expiry'
          value={formData.expiryDate.toISOString().split('T')[0]} // Display pre-filled value
          onChangeText={(text) =>
            setFormData({ ...formData, expiryDate: new Date(text) })
          }
        />
        <TextInput
          style={styles.input}
          placeholder='Weight/Quantity/Volume'
          value={formData.weightVolume} // Display pre-filled value
          onChangeText={(text) =>
            setFormData({ ...formData, weightVolume: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder='Additional Information'
          multiline={true}
          numberOfLines={3}
          value={formData.additionalInf} // Display pre-filled value
          onChangeText={(text) =>
            setFormData({ ...formData, additionalInf: text })
          }
        />
        <TouchableOpacity style={styles.imageButton}>
          <Text style={styles.imgText}>Add</Text>
          <Icon name='photo' size={24} color={COLORS['input-stroke']} />
        </TouchableOpacity>
        {/* Save Button */}
        <TouchableOpacity style={styles.button} onPress={() => handleAddItem()}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    alignItems: 'flex-end',
  },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: COLORS['input-stroke'],
  },
  imageButton: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: COLORS['input-stroke'],
  },
  imgText: {
    color: COLORS['input-stroke'],
    fontSize: 18,
    fontWeight: 'bold',
  },
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
