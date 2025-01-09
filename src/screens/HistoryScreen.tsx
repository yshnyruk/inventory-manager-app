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
import Search from '../components/Search';
import Link from '../components/Link';
import { HistoryStackParamList } from '../navigation/stack/HistoryStackNavigation';
import { StackScreenProps } from '@react-navigation/stack';
import { COLORS } from '../styles';

export type HistoryScreenProps = StackScreenProps<
  HistoryStackParamList,
  'HistoryMain'
>;

const HistoryScreen = ({ navigation, route }: HistoryScreenProps) => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const currentSpaceId = route.params?.parentId || 'Root';

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

  const hasActiveParent = (id: string, spaces: Array<any>): boolean => {
    const parent = spaces.find((space) => space.id === id);

    if (!parent) return false;
    if (parent.activeTo === undefined) return true;

    return hasActiveParent(parent.parentId, spaces);
  };

  const getFilteredSpaces = () => {
    const lowerSearch = search.toLowerCase();

    const filteredSpaces = spaces.filter(
      (e) =>
        e.activeTo !== undefined &&
        e.name.toLowerCase().includes(lowerSearch) &&
        (e.parentId === currentSpaceId || hasActiveParent(e.parentId, spaces)) // Додано перевірку на батька
    );
    return filteredSpaces;
  };

  const getFilteredItems = () => {
    const lowerSearch = search.toLowerCase();

    const filteredItems = items.filter(
      (e) =>
        e.activeTo !== undefined &&
        e.name.toLowerCase().includes(lowerSearch) &&
        (e.parentId === currentSpaceId || hasActiveParent(e.parentId, spaces)) // Додано перевірку на батька
    );
    return filteredItems;
  };

  const filteredSpaces = getFilteredSpaces();
  const filteredItems = getFilteredItems();

  return (
    <View style={styles.container}>
      <Search
        search={search}
        setSearch={setSearch}
        navigation={navigation}
        leftIcon='arrow-left'
      />
      <Link
        id={currentSpaceId}
        initialRoute='History'
        navigationStr='History'
      />

      {/* Main Content */}
      <Content
        filteredSpaces={filteredSpaces}
        filteredItems={filteredItems}
        onDeleteSuccess={loadData}
        context='history'
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
