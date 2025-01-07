import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { styles } from '../styles';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeStackParamList } from '../navigation/HomeStackNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddSpacePopup from '../modals/AddSpacePopup';
import AddItemPopup from '../modals/AddItemPopup';
import BottomButtons from '../components/BottomButtons';
import Link from '../components/Link';
import Search from '../components/Search';
import Content from '../components/Content';
import { useFocusEffect } from '@react-navigation/native';

// Define the type for HomeScreenProps
export type HomeScreenProps = StackScreenProps<HomeStackParamList, 'Home'>;

// Define the interface for Space
export interface Space {
  id: string;
  name: string;
  additionalInf: string;
  activeFrom: Date;
  activeTo?: Date;
  parentId: string;
}

// Define the interface for Item
export interface Item {
  id: string;
  name: string;
  additionalInf: string;
  activeFrom: Date;
  activeTo?: Date;
  parentId: string;
  category: string;
  number: number;
  expiryDate: Date;
  weightVolume: string;
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

  // Function to load data from AsyncStorage
  const loadData = async () => {
    try {
      const storedSpaces = await AsyncStorage.getItem('spaces');
      const storedItems = await AsyncStorage.getItem('items');

      if (storedSpaces) {
        const parsedSpaces = JSON.parse(storedSpaces);
        setSpaces(parsedSpaces);
        console.log('Loaded spaces:', parsedSpaces);
      }

      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        setItems(parsedItems);
        console.log('Loaded items:', parsedItems);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  // Load data from AsyncStorage when the component mounts
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // Function to handle adding a new space
  const handleAddSpace = (name: string) => {
    const newSpace: Space = {
      id: Date.now().toString(),
      name,
      additionalInf: '',
      activeFrom: new Date(),
      parentId: currentSpaceId,
    };

    setSpaces((prevSpaces) => {
      const updatedSpaces = [...prevSpaces, newSpace];

      AsyncStorage.setItem('spaces', JSON.stringify(updatedSpaces))
        .then(() => console.log('Spaces saved successfully!'))
        .catch((error) => console.error('Failed to save spaces:', error));

      return updatedSpaces;
    });

    setModalVisible(false);
    console.log('Added space:', newSpace);
  };

  // Function to get filtered data based on search and current space ID
  const getFilteredData = useCallback(() => {
    const lowerSearch = search.toLowerCase();
    const currentParentId = route.params?.parentId || 'Root';

    const filteredSpaces = spaces.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerSearch) &&
        item.parentId === currentParentId
    );

    const filteredItems = items.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerSearch) &&
        item.parentId === currentParentId
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
      <Search search={search} setSearch={setSearch} navigation={navigation} />
      <Link id={currentSpaceId} spaces={spaces} />
      <Content
        filteredSpaces={spaces}
        filteredItems={items}
        onDeleteSuccess={handleDeleteSuccess}
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

export default HomeScreen;
