import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  Modal,
} from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import { Item } from '../screens/HomeScreen';

type AddItemFormProps = {
  formData: Item;
  setFormData: (val: Item) => void;
  onSelectPhoto: () => void;
};

export const AddItemForm = ({
  formData,
  setFormData,
  onSelectPhoto,
}: AddItemFormProps) => {
  const [date, setDate] = useState<DateType>();
  const [dateOpened, setDateOpened] = useState(false);

  const handleDatePicker = () => {
    if (date)
      setFormData({ ...formData, expiryDate: new Date(date?.toString()) });
    setDateOpened(!dateOpened);
    console.log(date);
  };

  const handleDateClean = () => {
    setFormData({ ...formData, expiryDate: undefined });
    setDateOpened(!dateOpened);
    console.log(date);
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
        placeholder='Number'
        keyboardType='numeric'
        value={formData.number.toString()}
        onChangeText={(text) =>
          setFormData({
            ...formData,
            number: Number(text.replace(/[^0-9]/g, '')),
          })
        }
      />
      <Pressable
        style={[styles.input, { paddingVertical: 4, paddingHorizontal: 12 }]}
        onPress={() => setDateOpened(!dateOpened)}
      >
        <TextInput
          placeholder='Expiry Date'
          value={
            formData.expiryDate &&
            new Date(formData.expiryDate).toLocaleDateString()
          }
          editable={false}
          caretHidden={true}
          pointerEvents='none'
        />
      </Pressable>
      <Modal transparent visible={dateOpened}>
        <Pressable
          style={styles.datePickerContainer}
          onPress={() => setDateOpened(!dateOpened)}
        >
          <View style={styles.datePickerContent}>
            <DateTimePicker
              mode='single'
              date={date}
              onChange={(params) => setDate(params.date)}
            />
            <View style={styles.dateButtonsContainer}>
              <TouchableOpacity onPress={handleDateClean}>
                <View style={styles.dateButton}>
                  <Text style={styles.dateButtonText}>Clean</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDatePicker}>
                <View style={styles.dateButton}>
                  <Text style={styles.dateButtonText}>Select</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
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
        numberOfLines={20}
        value={formData.additionalInf}
        onChangeText={(text) =>
          setFormData({ ...formData, additionalInf: text })
        }
      />
      <View style={styles.imgContainer}>
        {formData.photoUri ? (
          <View>
            <Image source={{ uri: formData.photoUri }} style={styles.img} />
            <Pressable
              style={styles.imgClose}
              onPress={() => setFormData({ ...formData, photoUri: '' })}
            >
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
  datePickerContent: {
    width: '80%',
    height: '50%',
    backgroundColor: 'white',
    borderRadius: 12,
  },
  datePickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  dateButton: {
    paddingHorizontal: 48,
    padding: 12,
    borderRadius: 24,
    backgroundColor: COLORS['light-green'],
  },
  dateButtonText: {
    color: COLORS['dark-text-green'],
    fontWeight: 'bold',
  },
});

export default AddItemForm;
