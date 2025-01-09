import {
  View,
  Text,
  Modal,
  StyleSheet,
  Dimensions,
  Clipboard,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { COLORS, SHADOWS } from '../styles';

const ScannedItemModal = ({
  data,
  visible,
  setVisible,
}: {
  data: string;
  visible: boolean;
  setVisible: (val: boolean) => void;
}) => {
  function handleClose() {
    setVisible(!visible);
  }

  function CopyToClipboard() {
    setVisible(!visible);
    Clipboard.setString(data);
  }

  return (
    <Modal transparent visible={visible}>
      <View style={styles.centeredContainer}>
        <View style={styles.modalContainer}>
          <Text style={styles.label}>Scanned data:</Text>
          <Text style={styles.text}>{data}</Text>
          <View style={styles.buttonsView}>
            <TouchableOpacity onPress={handleClose}>
              <Text>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={CopyToClipboard}>
              <Text>Copy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS['light-green'],
    padding: 12,
    borderRadius: 12,
    maxWidth: Dimensions.get('window').width / 1.5,
    gap: 12,
    ...SHADOWS.medium,
  },
  label: {
    fontSize: 18,
  },
  text: {
    backgroundColor: 'white',
  },
  buttonsView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 24,
  },
});

export default ScannedItemModal;
