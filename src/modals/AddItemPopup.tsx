import React, { memo } from 'react';
import { Modal, Pressable, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../navigation/HomeStackNavigation';

interface AddItemPopupProps {
  navigation: StackNavigationProp<HomeStackParamList, 'Home'>;
  visible: boolean;
  onClose: () => void;
  onEnterDetails: () => void;
  onScanBarcode: () => void;
  parentId: string;
}
const AddItemPopup = memo<AddItemPopupProps>(
  ({
    visible,
    onClose,
    onEnterDetails,
    onScanBarcode,
    navigation,
    parentId,
  }) => {
    const onNavigate = () => {
      onClose();
      navigation.navigate('AddItem', { parentId: parentId });
    };

    return (
      <Modal transparent visible={visible}>
        <Pressable style={styles.itemPopupContainer} onPress={onClose}>
          <View style={styles.itemPopupContent}>
            <Pressable style={styles.itemPopupButton} onPress={onNavigate}>
              <Text style={styles.itemPopupText}>Enter item details</Text>
              <Icon name='pencil' size={24} color='#49454F' />
            </Pressable>
            <View style={styles.divider} />
            <Pressable
              style={[styles.itemPopupButton, { opacity: 0.5 }]}
              disabled={true}
            >
              <Text style={styles.itemPopupText}>Scan a QR/Barcode</Text>
              <Icon name='camera' size={24} color='#49454F' />
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    );
  }
);

export default AddItemPopup;
