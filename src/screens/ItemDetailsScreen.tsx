import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Header from '../components/Header';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeStackParamList } from '../navigation/stack/HomeStackNavigation';
import { COLORS, SHADOWS } from '../styles';
import { getItem } from '../services/storageService';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Item } from './HomeScreen';
import { useFocusEffect } from '@react-navigation/native';

type Props = StackScreenProps<HomeStackParamList, 'ItemDetails'>;

const ItemDetailsScreen = ({ route, navigation }: Props) => {
  const [item, setItem] = useState<Item>();
  const [expiryDate, setExpiryDate] = useState<Date>();
  const itemId = route.params.parentId;

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const item = await getItem(itemId, 'items');
        setItem(item);
        setExpiryDate(new Date(item.expiryDate));
      })();
    }, [])
  );

  return (
    <View style={styles.flexContainer}>
      <Header label={item?.name || 'Loading...'} navigation={navigation} />
      <View style={styles.flexContainer}>
        <View style={styles.img}></View>
        <View style={styles.flexContainer}></View>
        <View style={styles.content}>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddItem', { item: item })}
          >
            <View style={styles.editIcon}>
              <Icon name='pencil' size={20} color={COLORS['dark-text-green']} />
            </View>
          </TouchableOpacity>
          <Text style={[styles.normalText, styles.expirationDateText]}>
            Expiration date:
          </Text>
          <Text
            style={[
              styles.normalText,
              styles.expirationDateText,
              styles.dateText,
            ]}
          >
            {expiryDate?.getDate()}.{expiryDate?.getMonth()}.
            {expiryDate?.getFullYear()}
          </Text>

          <Text style={styles.titleText}>Number: {item?.number}</Text>
          <Text style={styles.titleText}>Weight: {item?.weightVolume}</Text>
          <Text style={styles.normalText}>{item?.additionalInf}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  img: {
    width: '100%',
    height: Dimensions.get('window').height / 2,
    backgroundColor: 'green',
  },
  flexContainer: {
    flex: 1,
  },
  content: {
    width: '100%',
    height: Dimensions.get('window').height / 2,
    borderRadius: 24,
    backgroundColor: COLORS.bg,
    position: 'absolute',
    bottom: -24,
  },
  editIcon: {
    borderRadius: 24,
    width: 48,
    height: 48,
    backgroundColor: COLORS['dark-green'],
    top: -24,
    right: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    ...SHADOWS.light,
  },
  titleText: {
    fontSize: 24,
    color: COLORS['dark-text-green'],
    marginTop: 8,
    marginLeft: 12,
  },
  normalText: {
    marginTop: 16,
    marginLeft: 12,
    marginRight: 12,
  },
  expirationDateText: {
    position: 'absolute',
    right: 12,
    top: 16,
  },
  dateText: {
    top: 32,
    fontWeight: 'bold',
  },
});

export default ItemDetailsScreen;
