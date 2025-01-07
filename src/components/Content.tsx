import React, { memo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Item, Space } from '../screens/HomeScreen';
import { styles } from '../styles';
import SpaceItem from './SpaceItem';

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

export default Content;
