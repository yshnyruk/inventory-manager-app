import {
  View,
  Text,
  Button,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, { useState } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

const ScannerModal = ({
  scannerVisible,
  setScannerVisible,
  showData,
  setScannedData,
}: {
  scannerVisible: boolean;
  setScannerVisible: (val: boolean) => void;
  showData: (val: boolean) => void;
  setScannedData: (val: string) => void;
}) => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [hasScanned, setHasScanned] = useState(false);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title='grant permission' />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  function handleBarcodeScanned(data: string) {
    if (!hasScanned) {
      setHasScanned(true);

      setScannerVisible(!scannerVisible);
      setScannedData(data);
      showData(true);

      setTimeout(() => setHasScanned(false), 2000);
    }
  }

  return (
    <Modal transparent visible={scannerVisible}>
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing={facing}
          onBarcodeScanned={({ data }) => handleBarcodeScanned(data)}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => setScannerVisible(!scannerVisible)}
            >
              <Text style={styles.text}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonFlip}
              onPress={toggleCameraFacing}
            >
              <Text style={[styles.text, { textAlign: 'center' }]}>
                Flip Camera
              </Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    margin: 24,
  },
  buttonFlip: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ScannerModal;
