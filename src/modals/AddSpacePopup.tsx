import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  TextInput,
} from 'react-native';
import React, { memo, useEffect, useState } from 'react';
import { COLORS } from '../styles';

const AddSpacePopup = memo(({ visible, onClose, onSave }: any) => {
  const [spaceName, setSpaceName] = useState('');

  const handlerClose = () => {
    setSpaceName('');
    onClose();
  };

  const handlerCreate = () => {
    setSpaceName('');
    onSave(spaceName);
  };

  return (
    <Modal transparent visible={visible}>
      <Pressable style={styles.modalContainer} onPress={handlerClose}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Name Your Space</Text>
          <TextInput
            style={styles.input}
            placeholder='Enter space name'
            value={spaceName}
            onChangeText={setSpaceName}
          />
          <View style={styles.buttonRow}>
            <Pressable
              style={styles.buttonTextContainer}
              onPress={handlerClose}
            >
              <Text style={{ color: 'black' }}>Close</Text>
            </Pressable>
            <Pressable
              style={styles.buttonTextContainer}
              onPress={handlerCreate}
              disabled={spaceName.trim().length === 0}
            >
              <Text style={{ color: 'black' }}>Create</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  modalContent: {
    width: '75%',
    backgroundColor: COLORS['light-green'],
    padding: 24,
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#49454F',
    marginBottom: 10,
    height: 36,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonTextContainer: {
    marginLeft: 24,
  },
});

export default AddSpacePopup;
