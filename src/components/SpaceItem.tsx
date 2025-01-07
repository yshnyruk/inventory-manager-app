import { useNavigation } from '@react-navigation/native';
import { memo } from 'react';
import { Pressable, View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Space, HomeScreenProps, Item } from '../screens/HomeScreen';
import { styles, COLORS } from '../styles';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SpaceItem = memo(
  ({
    item,
    type,
    onDeleteSuccess,
  }: {
    item: Space | Item;
    type: string;
    onDeleteSuccess: () => void;
  }) => {
    const navigation = useNavigation<HomeScreenProps['navigation']>();

    // Placeholder animation for swipe
    const renderRightActions = () => {
      return (
        <View style={localStyles.trashContainer}>
          <Icon name='trash' size={24} color={COLORS['dark-text-green']} />
        </View>
      );
    };

    const onDelete = async (itemId: string) => {
      const storageKey = type === 'space' ? 'spaces' : 'items';

      try {
        const data = await AsyncStorage.getItem(storageKey);

        if (data) {
          const items = JSON.parse(data) as Array<{
            id: string;
            parentId?: string;
          }>;
          const getChildrenIds = (
            parentId: string,
            items: Array<{ id: string; parentId?: string }>
          ) => {
            const children = items.filter((item) => item.parentId === parentId);
            let allChildrenIds = children.map((child) => child.id);

            children.forEach((child) => {
              allChildrenIds = allChildrenIds.concat(
                getChildrenIds(child.id, items)
              );
            });

            return allChildrenIds;
          };
          const idsToDelete =
            type === 'space'
              ? [itemId, ...getChildrenIds(itemId, items)]
              : [itemId];
          const updatedItems = items.filter(
            (item) => !idsToDelete.includes(item.id)
          );
          await AsyncStorage.setItem(storageKey, JSON.stringify(updatedItems));

          console.log(
            `${type} with ID ${itemId} and its children were deleted.`
          );
          onDeleteSuccess();
        }
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    };

    return (
      <Swipeable
        renderRightActions={renderRightActions}
        onSwipeableOpen={() => onDelete(item.id)}
      >
        <Pressable
          style={[
            styles.spaceItemContainer,
            type === 'space' && { backgroundColor: COLORS['dark-green'] },
            type === 'item' && { backgroundColor: '#f2f2f2' },
          ]}
          onPress={
            type === 'space'
              ? () => navigation.push('Home', { parentId: item.id })
              : () => {}
          }
        >
          <View style={styles.spaceItemImage} />
          <View style={styles.spaceItemAllText}>
            <Text style={styles.spaceItemTitle}>{item.name}</Text>
            <Text style={styles.spaceItemDesc}>{item.additionalInf}</Text>
          </View>
          <Icon name='arrow-right' size={10} color='#49454F' />
        </Pressable>
        <View style={styles.divider} />
      </Swipeable>
    );
  }
);

const localStyles = StyleSheet.create({
  actionText: {
    color: COLORS['dark-text-green'],
    fontSize: 16,
    fontWeight: 'bold',
  },
  trashContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 12,
    width: Dimensions.get('window').width / 1.5,
  },
});

export default SpaceItem;
