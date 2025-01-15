import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeStackParamList } from '../navigation/stack/HomeStackNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddSpacePopup from '../modals/AddSpacePopup';
import AddItemPopup from '../modals/AddItemPopup';
import BottomButtons from '../components/BottomButtons';
import Link from '../components/Link';
import Search from '../components/Search';
import Content from '../components/Content';
import { useFocusEffect } from '@react-navigation/native';
import { getData, setData } from '../services';
import { COLORS } from '../styles';
import { AuthContext } from '../contexts/AuthContext';
import { push, ref, set } from 'firebase/database';
import { db } from '../services/firebase';

// Define the type for HomeScreenProps
export type HomeScreenProps = StackScreenProps<HomeStackParamList, 'Home'>;

// Define the interface for Space
export interface Space {
  id: string;
  name: string;
  emoji?: string;
  activeFrom: string;
  activeTo?: string | null;
  parentId: string;
}

// Define the interface for Item
export interface Item {
  id: string;
  name: string;
  additionalInf?: string;
  activeFrom: string;
  activeTo?: string | null;
  parentId: string;
  number: number;
  expiryDate?: Date;
  weightVolume?: string;
  photoUri: string;
  emoji?: string;
}

const HomeScreen = ({ navigation, route }: HomeScreenProps) => {
  // State for spaces, items, modal visibility, space name, search, and item popup visibility
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [spaceName, setSpaceName] = useState('');
  const [search, setSearch] = useState('');
  const [itemPopupVisible, setItemPopupVisible] = useState(false);
  const [addItemVisible, setAddItemVisible] = useState(false);
  // Determine the current space ID based on route parameters
  const currentSpaceId = route.params?.parentId || 'Root';
  const { user, dataLoaded } = useContext(AuthContext);

  // Function to load data from AsyncStorage
  const loadData = async () => {
    const spaces = await getData('spaces');
    const items = await getData('items');
    setSpaces(spaces);
    setItems(items);
  };

  // Load data from AsyncStorage when the component mounts
  useFocusEffect(
    useCallback(() => {
      loadData();
      console.log('Refershing data...');
    }, [dataLoaded])
  );

  // Function to handle adding a new space
  const handleAddSpace = (name: string) => {
    const newSpace: Space = {
      id: new Date().toISOString(),
      name,
      activeFrom: new Date().toISOString(),
      parentId: currentSpaceId,
    };

    setSpaces((prevSpaces) => {
      const updatedSpaces = [...prevSpaces, newSpace];
      setData('spaces', updatedSpaces);
      if (user) {
        const spacesRef = ref(db, `users/${user.uid}/spaces`);
        set(spacesRef, updatedSpaces);
      }
      return updatedSpaces;
    });

    setModalVisible(false);
  };

  // Function to get filtered data based on search and current space ID
  const getFilteredData = useCallback(() => {
    const lowerSearch = search.toLowerCase();
    const currentParentId = route.params?.parentId || 'Root';

    const filteredSpaces = spaces.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerSearch) &&
        item.parentId === currentParentId &&
        item.activeTo === null
    );

    const filteredItems = items.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerSearch) &&
        item.parentId === currentParentId &&
        item.activeTo === null
    );

    return { filteredSpaces, filteredItems };
  }, [search, spaces, items, route.params?.parentId]);

  // Get filtered data
  const { filteredSpaces, filteredItems } = getFilteredData();

  const handleDeleteSuccess = () => {
    loadData(); // Reload data to refresh the list
  };

  return (
    <View style={styles.container}>
      <Search
        search={search}
        setSearch={setSearch}
        navigation={navigation}
        leftIcon='bars'
      />
      <Link id={currentSpaceId} initialRoute='Home' navigationStr='Home' />
      <Content
        filteredSpaces={filteredSpaces}
        filteredItems={filteredItems}
        onDeleteSuccess={handleDeleteSuccess}
        context='home'
        canChangeSmiles={true}
      />
      <BottomButtons
        onAddSpace={() => setModalVisible(true)}
        onAddItem={() => setItemPopupVisible(true)}
      />
      <AddSpacePopup
        visible={modalVisible}
        spaceName={spaceName}
        setSpaceName={setSpaceName}
        onClose={() => {
          setModalVisible(false);
          setSpaceName('');
        }}
        onSave={handleAddSpace}
      />
      <AddItemPopup
        navigation={navigation}
        visible={itemPopupVisible}
        setVisible={setModalVisible}
        onClose={() => setItemPopupVisible(false)}
        parentId={currentSpaceId}
        onEnterDetails={() => {
          setItemPopupVisible(false);
          setAddItemVisible(true);
        }}
        onScanBarcode={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 48,
    backgroundColor: COLORS.bg,
  },
});

export default HomeScreen;
