import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { COLORS } from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';

export const AddItemForm = ({ formData, setFormData }: any) => {
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
      <TouchableOpacity style={styles.imageButton}>
        <Text style={styles.imgText}>Add</Text>
        <Icon name='photo' size={24} color={COLORS['input-stroke']} />
      </TouchableOpacity>
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
});

export default AddItemForm;
