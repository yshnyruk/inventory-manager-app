import React, { memo } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { Item, Space } from '../screens/HomeScreen';
import SpaceItem from './SpaceItem';
import { COLORS } from '../styles';

const Content = memo(
  ({ filteredSpaces, filteredItems, onDeleteSuccess }: any) => (
    <ScrollView>
      {filteredSpaces.length === 0 && filteredItems.length === 0 ? (
        <Text style={styles.emptyText}>It is empty here...</Text>
      ) : (
        <View style={styles.contentContainer}>
          {filteredSpaces.map((item: Space) => (
            <SpaceItem
              key={item.id}
              item={item}
              type='space'
              onDeleteSuccess={onDeleteSuccess}
            />
          ))}
          {filteredItems.map((item: Item) => (
            <SpaceItem
              key={item.id}
              item={item}
              type='item'
              onDeleteSuccess={onDeleteSuccess}
            />
          ))}
        </View>
      )}
    </ScrollView>
  )
);

const styles = StyleSheet.create({
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    fontWeight: '400',
    color: COLORS.black,
  },
  contentContainer: {
    flex: 1,
    gap: 3,
  },
});

export default Content;
