import React, { memo, useState } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { Item, Space } from '../screens/HomeScreen';
import SpaceItem from './SpaceItem';
import { COLORS } from '../styles';

const Content = memo(
  ({ filteredSpaces, filteredItems, onDeleteSuccess }: any) => {
    const [isScrolling, setIsScrolling] = useState(true);

    const disableScroll = () => setIsScrolling(false);
    const enableScroll = () => setIsScrolling(true);

    return (
      <ScrollView scrollEnabled={isScrolling}>
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
                disableScroll={disableScroll}
                enableScroll={enableScroll}
              />
            ))}
            {filteredItems.map((item: Item) => (
              <SpaceItem
                key={item.id}
                item={item}
                type='item'
                onDeleteSuccess={onDeleteSuccess}
                disableScroll={disableScroll}
                enableScroll={enableScroll}
              />
            ))}
          </View>
        )}
      </ScrollView>
    );
  }
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
