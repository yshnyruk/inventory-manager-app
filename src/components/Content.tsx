import React, { memo, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { Item, Space } from '../screens/HomeScreen';
import SpaceItem from './SpaceItem';
import { COLORS, SHADOWS } from '../styles';
import EmojiSelector from 'react-native-emoji-selector';
import { updateObject } from '../services/storageService';

type SelectedItem = {
  id: string;
  type: 'items' | 'spaces';
};

const Content = memo(
  ({
    filteredSpaces,
    filteredItems,
    onDeleteSuccess,
    canChangeSmiles,
  }: any) => {
    const [isScrolling, setIsScrolling] = useState(true);
    const [emoji, setEmoji] = useState(false);
    const disableScroll = () => setIsScrolling(false);
    const enableScroll = () => setIsScrolling(true);
    const [selectedItem, setSelectedItem] = useState<SelectedItem>({
      id: '',
      type: 'items',
    });

    async function onSetEmoji(emoji: string) {
      await updateObject(selectedItem.id, { emoji: emoji }, selectedItem.type);
      setEmoji(!emoji);
      onDeleteSuccess();
    }

    return (
      <View style={{ flex: 1 }}>
        <Modal transparent visible={emoji}>
          <Pressable
            style={styles.centeredContainer}
            onPress={() => setEmoji(!emoji)}
          >
            <Pressable style={styles.emojiContainer}>
              <View style={styles.emojiContent}>
                <EmojiSelector
                  onEmojiSelected={onSetEmoji}
                  placeholder='Search...'
                />
              </View>
            </Pressable>
          </Pressable>
        </Modal>
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
                  setEmoji={setEmoji}
                  setSelectedItem={setSelectedItem}
                  canChangeSmiles={canChangeSmiles}
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
                  setEmoji={setEmoji}
                  setSelectedItem={setSelectedItem}
                  canChangeSmiles={canChangeSmiles}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
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
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiContainer: {
    width: '80%',
    height: '50%',
    backgroundColor: COLORS['light-green'],
    padding: 12,
    borderRadius: 12,
    ...SHADOWS.medium,
  },
  emojiContent: {
    flex: 1,
    marginBottom: 36,
  },
});

export default Content;
