import React, { memo, useState } from 'react';
import {
  Modal,
  Pressable,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../navigation/stack/HomeStackNavigation';
import { COLORS } from '../styles';
import ScannerModal from './ScannerModal';
import ScannedItemModal from './ScannedItemModal';

interface AddItemPopupProps {
  navigation: StackNavigationProp<HomeStackParamList, 'Home'>;
  visible: boolean;
  onClose: () => void;
  onEnterDetails: () => void;
  onScanBarcode: () => void;
  parentId: string;
  setVisible: (val: boolean) => void;
}
const AddItemPopup = memo<AddItemPopupProps>(
  ({
    visible,
    onClose,
    onEnterDetails,
    onScanBarcode,
    navigation,
    parentId,
    setVisible,
  }) => {
    const [scannerVisible, setScannerVisible] = useState(false);
    const [scannedItemVisible, setScannedItemVisible] = useState(false);
    const [scannedData, setScannedData] = useState('');

    const onNavigate = () => {
      onClose();
      navigation.navigate('AddItem', { parentId: parentId });
    };

    const handleBarcodeScanned = (data: string) => [console.log(data)];

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
              style={styles.itemPopupButton}
              onPress={() => setScannerVisible(!scannerVisible)}
            >
              <Text style={styles.itemPopupText}>Scan a QR/Barcode</Text>
              <Icon name='camera' size={24} color='#49454F' />
            </Pressable>
          </View>
        </Pressable>

        <ScannerModal
          scannerVisible={scannerVisible}
          setScannerVisible={setScannerVisible}
          showData={setScannedItemVisible}
          setScannedData={setScannedData}
        />

        <ScannedItemModal
          data={scannedData}
          visible={scannedItemVisible}
          setVisible={setScannedItemVisible}
        />
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  itemPopupContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingBottom: 65,
    paddingRight: 90,
  },
  itemPopupContent: {
    backgroundColor: 'white',
    borderWidth: 4,
    borderColor: COLORS['input-stroke'],
    borderRadius: 12,
    padding: 16,
    gap: 8,
    width: 250,
  },
  itemPopupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomColor: '#CAC4D0',
  },
  itemPopupText: {
    fontSize: 16,
    color: '#49454F',
  },
  divider: {
    marginTop: 3,
    height: 1,
    backgroundColor: COLORS.divider,
    width: '100%',
  },
});

export default AddItemPopup;
