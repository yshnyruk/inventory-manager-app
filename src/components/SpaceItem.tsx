import { useNavigation } from '@react-navigation/native';
import { memo, useState } from 'react';
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
  toHistory,
  toHistoryCasc,
} from '../services/storageService';

const SpaceItem = memo(
  ({
    item,
    type,
    onDeleteSuccess,
    disableScroll,
    enableScroll,
  }: {
    item: Space | Item;
    type: string;
    onDeleteSuccess: () => void;
    disableScroll: () => void;
    enableScroll: () => void;
  }) => {
    const navigation = useNavigation<HomeScreenProps['navigation']>();
    const [translateX] = useState(new Animated.Value(0));
    const screenWidth = Dimensions.get('window').width;

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
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        enableScroll();
        if (Math.abs(gestureState.dx) > screenWidth * 0.6) {
          handleDelete();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    });

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
                  await toHistoryCasc(item.id);
                  onDeleteSuccess();
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          await toHistory(item.id, 'spaces');
          onDeleteSuccess();
        }
      } else {
        await toHistory(item.id, 'items');
      }
      onDeleteSuccess();
    };

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
            onPress={
              type === 'space'
                ? () => navigation.push('Home', { parentId: item.id })
                : () =>
                    navigation.navigate('ItemDetails', { parentId: item.id })
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
});

export default SpaceItem;
