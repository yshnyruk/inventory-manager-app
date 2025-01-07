import { useNavigation } from '@react-navigation/native';
import { memo } from 'react';
import { Pressable, View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Space, HomeScreenProps, Item } from '../screens/HomeScreen';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../styles';

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
        <View style={styles.trashContainer}>
          <Icon name='trash' size={24} color={COLORS['dark-text-green']} />
        </View>
      );
    };

    return (
      <View
      // renderRightActions={renderRightActions}
      // onSwipeableOpen={() => onDelete(item.id)}
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
              : () => navigation.navigate('ItemDetails', { parentId: item.id })
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
});

export default SpaceItem;
