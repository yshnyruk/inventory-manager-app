import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useCallback, useState } from 'react';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/RootNavigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';
import Content from '../components/Content';
import { Item, Space } from './HomeScreen';
import { getData } from '../services';
import { useFocusEffect } from '@react-navigation/native';

interface HistoryScreenProps {
  navigation: DrawerNavigationProp<RootDrawerParamList, 'History'>;
}

const HistoryScreen = ({ navigation }: HistoryScreenProps) => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const loadData = async () => {
    const spaces = await getData('spaces');
    const items = await getData('items');
    setSpaces(spaces);
    setItems(items);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
      console.log(items);
    }, [])
  );

  const getFilteredSpaces = () => {
    const filteredSpaces = spaces.filter((e) => e.activeTo !== undefined);
    return filteredSpaces;
  };

  const getFilteredItems = () => {
    const filteredItems = items.filter((e) => e.activeTo !== undefined);
    return filteredItems;
  };

  const filteredSpaces = getFilteredSpaces();
  const filteredItems = getFilteredItems();

  return (
    <View style={styles.container}>
      <Header label='History' navigation={navigation} />

      {/* Main Content */}
      <Content
        filteredSpaces={filteredSpaces}
        filteredItems={filteredItems}
        onDeleteSuccess={useFocusEffect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 24,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 3,
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
});

export default HistoryScreen;
