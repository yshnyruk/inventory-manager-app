import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useCallback, useState } from 'react';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../navigation/RootNavigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';
import Content from '../components/Content';
import { Item, Space } from './HomeScreen';
import { useFocusEffect } from '@react-navigation/native';
import Search from '../components/Search';
import Link from '../components/Link';
import { HistoryStackParamList } from '../navigation/stack/HistoryStackNavigation';
import { StackScreenProps } from '@react-navigation/stack';
import { COLORS } from '../styles';
import { getFromStorage } from '../services/storageService';
import { filterItems, filterSpaces } from '../utils/filters';

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
    const spaces = await getFromStorage('spaces');
    const items = await getFromStorage('items');
    setSpaces(spaces);
    setItems(items);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
      console.log(items);
    }, [])
  );

  const filteredSpaces = filterSpaces(spaces, search, currentSpaceId);
  const filteredItems = filterItems(items, search, currentSpaceId, spaces);

  return (
    <View style={styles.container}>
      <Search
        search={search}
        setSearch={setSearch}
        navigation={navigation}
        leftIcon='chevron-left'
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
        canChangeSmiles={false}
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

export default HistoryScreen;
