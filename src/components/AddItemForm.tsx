import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';

export const AddItemForm = ({ formData, setFormData, onSelectPhoto }: any) => {
  const clearPhoto = () => {
    setFormData({ ...formData, photoUri: null });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder='Name'
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder='Category'
        value={formData.category}
        onChangeText={(text) => setFormData({ ...formData, category: text })}
      />
      <TextInput
        style={styles.input}
        placeholder='Number'
        keyboardType='numeric'
        value={formData.number !== null ? formData.number.toString() : ''}
        onChangeText={(text) =>
          setFormData({
            ...formData,
            number: text ? parseInt(text, 10) : null,
          })
        }
      />
      <TextInput
        style={styles.input}
        placeholder='Date of Expiry'
        value={formData.expiryDate}
        onChangeText={(text) =>
          setFormData({ ...formData, expiryDate: new Date(text) })
        }
      />
      <TextInput
        style={styles.input}
        placeholder='Weight/Quantity/Volume'
        value={formData.weightVolume}
        onChangeText={(text) =>
          setFormData({ ...formData, weightVolume: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder='Additional Information'
        multiline={true}
        numberOfLines={3}
        value={formData.additionalInf}
        onChangeText={(text) =>
          setFormData({ ...formData, additionalInf: text })
        }
      />
      <View style={styles.imgContainer}>
        {formData.photoUri ? (
          <View>
            <Image source={{ uri: formData.photoUri }} style={styles.img} />
            <Pressable style={styles.imgClose} onPress={clearPhoto}>
              <Text style={styles.x}>x</Text>
            </Pressable>
          </View>
        ) : (
          []
        )}
        <TouchableOpacity style={styles.imageButton} onPress={onSelectPhoto}>
          <Text style={styles.imgText}>Add</Text>
          <Icon name='photo' size={24} color={COLORS['input-stroke']} />
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
  img: {
    width: 48,
    height: 48,
  },
  imgContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  imgClose: {
    backgroundColor: 'gray',
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    top: -12,
    left: -12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  x: {
    color: 'white',
  },
});

export default AddItemForm;
