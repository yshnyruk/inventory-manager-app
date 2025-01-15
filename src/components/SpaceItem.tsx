import {
  CompositeScreenProps,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { memo, useContext, useEffect, useState } from 'react';
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Space, HomeScreenProps, Item } from '../screens/HomeScreen';
import { COLORS } from '../styles';
import { getData, setData } from '../services';
import {
  deleteCasc,
  deleteOne,
  hasChildren,
  restore,
  restoreCasc,
  toHistory,
  toHistoryCasc,
} from '../services/storageService';
import { HistoryScreenProps } from '../screens/HistoryScreen';
import { ref, set } from 'firebase/database';
import { db } from '../services/firebase';
import { AuthContext } from '../contexts/AuthContext';
type Props = CompositeScreenProps<HistoryScreenProps, HomeScreenProps>;

const SpaceItem = memo(
  ({
    item,
    type,
    onDeleteSuccess,
    disableScroll,
    enableScroll,
    setEmoji,
    setSelectedItem,
    canChangeSmiles,
  }: {
    item: Space | Item;
    type: 'item' | 'space';
    onDeleteSuccess: () => void;
    disableScroll: () => void;
    enableScroll: () => void;
    setEmoji: (val: boolean) => void;
    setSelectedItem: (val: { id: string; type: 'items' | 'spaces' }) => void;
    canChangeSmiles: boolean;
  }) => {
    const navigation = useNavigation<Props['navigation']>();
    const route = useRoute<Props['route']>();
    const [translateX] = useState(new Animated.Value(0));
    const screenWidth = Dimensions.get('window').width;
    const [itemNames, setItemNames] = useState<string>('');
    const [screenName, setScreenName] = useState('');
    const { user } = useContext(AuthContext);

    const loadItemNames = async () => {
      const names = await formatItemNames(item.id);
      setItemNames(names);
    };

    useEffect(() => {
      loadItemNames();
    }, [item.id]);

    const panResponder = PanResponder.create({
      onPanResponderGrant: () => {
        disableScroll();
      },
      onStartShouldSetPanResponderCapture: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
          Math.abs(gestureState.dx) > 10
        );
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderMove: (_, gestureState) => {
        if (Math.abs(gestureState.dy) > Math.abs(gestureState.dx)) {
          return;
        }
        translateX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        enableScroll();
        if (routeName === 'HistoryMain') {
          if (gestureState.dx < -screenWidth * 0.6) {
            handleDeletePermanent();
          } else if (gestureState.dx > screenWidth * 0.6) {
            handleSetActiveToUndefined();
          } else {
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        } else if (Math.abs(gestureState.dx) > screenWidth * 0.6) {
          handleDelete();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    });

    const getItemsInSpace = async (spaceId: string) => {
      const spaces: Space[] = await getData('spaces');
      const items: Item[] = await getData('items');

      const spacesInSpace = spaces.filter(
        (space) => space.parentId === spaceId
      );
      const itemsInSpace = items.filter((item) => item.parentId === spaceId);

      const filteredSpaces =
        routeName === 'HistoryMain'
          ? spacesInSpace.filter((space) => space.activeTo !== undefined)
          : spacesInSpace.filter((space) => space.activeTo === undefined);

      const filteredItems =
        routeName === 'HistoryMain'
          ? itemsInSpace.filter((item) => item.activeTo !== undefined)
          : itemsInSpace.filter((item) => item.activeTo === undefined);

      return [...filteredSpaces, ...filteredItems];
    };

    const formatItemNames = async (spaceId: string) => {
      const itemsAndSpaces = await getItemsInSpace(spaceId);
      const names = itemsAndSpaces.map((item) => item.name);
      const maxItemsToShow = 3;
      const truncatedNames = names.slice(0, maxItemsToShow).join(', ');

      if (names.length > maxItemsToShow) {
        return `${truncatedNames}, ...`;
      }

      return truncatedNames;
    };

    const handleSetActiveToUndefined = async () => {
      const key = type === 'item' ? 'items' : 'spaces';
      if (key === 'spaces') {
        const has = await hasChildren(item.id);
        if (has) {
          Alert.alert(
            'Restore confirmation',
            `Do you want to restore ${item.name} with all its items inside?`,
            [
              {
                text: 'Cancel',
                onPress: () =>
                  Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true,
                  }).start(),
              },
              {
                text: 'OK',
                onPress: async () => {
                  await restoreCasc(item.id, user);
                  onDeleteSuccess();
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          await restore(item.id, 'spaces', user);
          onDeleteSuccess();
        }
      } else {
        await restore(item.id, 'items', user);
      }
      onDeleteSuccess();
    };

    const handleDeletePermanent = async () => {
      const key = type === 'item' ? 'items' : 'spaces';
      if (key === 'spaces') {
        const has = await hasChildren(item.id);
        if (has) {
          Alert.alert(
            'Delete confirmation',
            `Do you want to delete ${item.name} for EVER with all its items inside?`,
            [
              {
                text: 'Cancel',
                onPress: () =>
                  Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true,
                  }).start(),
              },
              {
                text: 'OK',
                onPress: async () => {
                  await deleteCasc(item.id, user);
                  onDeleteSuccess();
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          await deleteOne(item.id, 'spaces', user);
          onDeleteSuccess();
        }
      } else {
        await deleteOne(item.id, 'items', user);
      }
      onDeleteSuccess();
    };

    const handleDelete = async () => {
      const key = type === 'item' ? 'items' : 'spaces';
      if (key === 'spaces') {
        const has = await hasChildren(item.id);
        if (has) {
          Alert.alert(
            'Delete confirmation',
            `Do you want to delete ${item.name} with all its items inside?`,
            [
              {
                text: 'Cancel',
                onPress: () =>
                  Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true,
                  }).start(),
              },
              {
                text: 'OK',
                onPress: async () => {
                  await toHistoryCasc(item.id, user);
                  onDeleteSuccess();
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          await toHistory(item.id, 'spaces', user);
          onDeleteSuccess();
        }
      } else {
        await toHistory(item.id, 'items', user);
      }
      onDeleteSuccess();
    };

    const onSelectEmoji = () => {
      if (canChangeSmiles) {
        const key = type === 'item' ? 'items' : 'spaces';
        setSelectedItem({ id: item.id, type: key });
        setEmoji(true);
      }
    };

    const routeName: string = route.name;
    return (
      <View>
        <Animated.View
          style={{
            transform: [{ translateX }],
          }}
          {...panResponder.panHandlers}
        >
          <Pressable
            style={[
              styles.spaceItemContainer,
              type === 'space' && { backgroundColor: COLORS['dark-green'] },
              type === 'item' && { backgroundColor: '#f2f2f2' },
            ]}
            onPress={() => {
              if (type === 'space') {
                navigation.push(route.name, { parentId: item.id });
              } else {
                if (routeName === 'Home') {
                  navigation.navigate('ItemDetails', { parentId: item.id });
                } else {
                  navigation.navigate('HistoryItem', { parentId: item.id });
                }
              }
            }}
          >
            <Pressable onPress={onSelectEmoji}>
              <Text style={styles.emoji}>
                {item.emoji ? item.emoji : '[   ]'}
              </Text>
            </Pressable>
            <View style={styles.spaceItemAllText}>
              <Text style={styles.spaceItemTitle}>{item.name}</Text>
              {type === 'space' ? (
                <Text style={styles.itemsInSpace} numberOfLines={1}>
                  {itemNames ? itemNames : 'empty'}
                </Text>
              ) : (
                <Text style={styles.spaceItemDesc} numberOfLines={1}>
                  {(item as Item).additionalInf}
                </Text>
              )}
            </View>
            <Icon name='chevron-right' size={10} color='#49454F' />
          </Pressable>
          <View style={styles.divider} />
        </Animated.View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  spaceItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  spaceItemImage: {
    height: 58,
    width: 58,
    backgroundColor: COLORS['light-green'],
    marginRight: 18,
    borderRadius: 8,
  },
  spaceItemAllText: {
    flex: 1,
  },
  spaceItemTitle: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  spaceItemDesc: {
    color: '#49454F',
  },
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
  divider: {
    marginTop: 3,
    height: 1,
    backgroundColor: COLORS.divider,
    width: '100%',
  },
  deleteContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    backgroundColor: 'light-red',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  itemsInSpace: {
    fontSize: 12,
    color: COLORS['dark-text-green'],
    marginTop: 4,
  },
  emoji: {
    fontSize: 32,
    marginRight: 18,
  },
});

export default SpaceItem;
