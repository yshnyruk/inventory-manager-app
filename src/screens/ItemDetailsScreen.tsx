import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Header from '../components/Header';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { HomeStackParamList } from '../navigation/stack/HomeStackNavigation';
import { COLORS, SHADOWS } from '../styles';
import { getItem, updateObject } from '../services/storageService';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Item } from './HomeScreen';
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';
import { HistoryStackParamList } from '../navigation/stack/HistoryStackNavigation';
import { template } from '@babel/core';
import EditButton from '../components/EditButton';
import UseNotifications from '../modals/UseNotifications';

type HomeProps = StackScreenProps<HomeStackParamList, 'ItemDetails'>;
type HistoryProps = StackScreenProps<HistoryStackParamList, 'HistoryItem'>;

type Props = HomeProps | HistoryProps;

const ItemDetailsScreen = ({ route, navigation }: Props) => {
  const [item, setItem] = useState<Item>();
  const [expiryDate, setExpiryDate] = useState<Date>();
  const [activeTo, setActiveTo] = useState<Date>();
  const [activeFrom, setActiveFrom] = useState<Date>();
  const [reminder, setReminder] = useState<boolean>(false);
  const itemId = route.params.parentId;

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const item = await getItem(itemId, 'items');
        setItem(item);

        if (item && item.expiryDate) {
          const parsedDate = new Date(item.expiryDate);
          if (!isNaN(parsedDate.getTime())) {
            setExpiryDate(parsedDate);
          } else {
            console.warn('Invalid expiryDate:', item.expiryDate);
            setExpiryDate(undefined);
          }
        } else {
          console.warn('expiryDate is undefined or item is missing:', item);
          setExpiryDate(undefined);
        }

        if (item && item.activeTo) {
          const parsedDate = new Date(item.activeTo);
          if (!isNaN(parsedDate.getTime())) {
            setActiveTo(parsedDate);
          } else {
            console.warn('Invalid activeTo:', item.activeTo);
            setActiveTo(undefined);
          }
        } else {
          console.warn('activeTo is undefined or item is missing:', item);
          setActiveTo(undefined);
        }

        {
          const parsedDate = new Date(item.activeFrom);
          setActiveFrom(parsedDate);
        }

        console.log('Item:', item);
      })();
    }, [])
  );

  const handlePress = async () => {
    if (route.name === 'ItemDetails') {
      const homeNavigation = navigation as StackNavigationProp<
        HomeStackParamList,
        'ItemDetails'
      >;
      homeNavigation.navigate('AddItem', { item });
    } else {
      if (item) {
        await updateObject(item.id, { activeTo: undefined }, 'items');
        navigation.goBack();
      } else {
        console.warn('Item is not loaded yet.');
      }
    }
  };

  const handlePressReminder = async () => {
    console.log('Tap on Reminder');
    if (!item) {
      console.warn('Item is not loaded yet.');
      return;
    }

    if (!item.expiryDate) {
      alert('Please set an expiry date');
      return;
    }

    const now = new Date();
    const expiryDate = new Date(item.expiryDate);

    if (now > expiryDate) {
      alert('Oops... Expiry date cannot be earlier than today.');
      return;
    }

    setReminder(true);
  };

  return (
    <View style={styles.flexContainer}>
      <Header label={item?.name || 'Loading...'} navigation={navigation} />
      <View style={styles.flexContainer}>
        {item?.photoUri ? (
          <Image source={{ uri: item.photoUri }} style={styles.img}></Image>
        ) : (
          <View style={styles.img}>
            <Text style={styles.imgText}>No image</Text>
          </View>
        )}
        <View style={styles.flexContainer}></View>

        <View style={styles.content}>
          {route.name === 'ItemDetails' ? (
            <View style={styles.editButtonContainer}>
              <EditButton icon='bell' onPress={handlePressReminder} />
              <EditButton icon='pencil' onPress={handlePress} />
            </View>
          ) : (
            <View style={styles.editButtonContainer}>
              <EditButton text='Restore' onPress={handlePress} />
            </View>
          )}

          {expiryDate && (
            <View>
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
            </View>
          )}

          <Text style={styles.titleText}>Number: {item?.number}</Text>
          {item?.weightVolume && (
            <Text style={styles.titleText}>Weight: {item?.weightVolume}</Text>
          )}
          <Text style={styles.normalText}>{item?.additionalInf}</Text>
          <View style={{ flex: 1 }}>
            <View
              style={{
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                paddingBottom: 48,
                flexDirection: 'row',
                flex: 1,
                gap: 12,
              }}
            >
              <Text style={{ width: 180 }}>
                Created: {activeFrom?.getHours()}:{activeFrom?.getMinutes()}{' '}
                {activeFrom?.getDay()}.{activeFrom?.getMonth()}.
                {activeFrom?.getFullYear()}
              </Text>
              {activeTo && (
                <Text style={{ width: 180 }}>
                  Deleted: {activeTo?.getHours()}:{activeTo?.getMinutes()}{' '}
                  {activeTo?.getDay()}.{activeTo?.getMonth()}.
                  {activeTo?.getFullYear()}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
      {item && (
        <Modal transparent visible={reminder}>
          <UseNotifications setReminder={setReminder} item={item} />
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  img: {
    width: '100%',
    height: Dimensions.get('window').height / 2,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    top: -32,
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
  restoreItem: {
    alignSelf: 'flex-end',
    position: 'absolute',
    backgroundColor: COLORS['dark-green'],
    top: -24,
    right: 24,
    borderRadius: 12,
    ...SHADOWS.medium,
  },
  restoreText: {
    margin: 12,
    width: 70,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: COLORS['dark-text-green'],
  },
  editButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: -24,
    right: 24,
    gap: 24,
  },
});

export default ItemDetailsScreen;
