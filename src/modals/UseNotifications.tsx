import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
  TouchableOpacity,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { COLORS, SHADOWS } from '../styles/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Modal } from 'react-native';
import PickReminderDate from './PickReminderDate';
import { Item } from '../screens/HomeScreen';
import { getItem } from '../services/storageService';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { TextInput } from 'react-native-gesture-handler';

type Props = {
  setReminder: (reminder: boolean) => void;
  item: Item;
};

export type ReminderDate = {
  label: string;
  value: number;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const UseNotifications = ({ setReminder, item }: Props) => {
  const reminderDates: ReminderDate[] = [
    { label: 'The same day', value: 0 },
    { label: '1 day before', value: 1 },
    { label: '2 days before', value: 2 },
    { label: '3 days before', value: 3 },
    { label: '1 week before', value: 7 },
    { label: '2 weeks before', value: 14 },
    { label: '1 month before', value: 30 },
  ];

  const [pickDate, setPickDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState<ReminderDate>();
  const [notificationId, setNotificationId] = useState<string | null>(null);
  const [title, setTitle] = useState(item.name);

  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permission required',
        'Please enable notifications in settings.'
      );
      setReminder(false);
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  };

  const getReminderDate = (
    expiryDate: Date,
    daysBefore: number
  ): Date | null => {
    const expiry = new Date(expiryDate);
    if (isNaN(expiry.getTime())) {
      console.error('Invalid expiryDate:', expiryDate);
      return null;
    }
    const millisecondsInADay = 1000 * 60 * 60 * 24;
    const reminderTimestamp =
      expiry.getTime() - daysBefore * millisecondsInADay;
    const reminderDate = new Date(reminderTimestamp);
    return reminderDate;
  };

  const scheduleNotification = async () => {
    if (selectedDate && !isNaN(selectedDate.value) && item.expiryDate) {
      try {
        const reminderDate = getReminderDate(
          item.expiryDate,
          selectedDate.value
        );
        if (reminderDate) {
          const id = await Notifications.scheduleNotificationAsync({
            content: {
              title: title,
              body: `Reminder: Expiry date (${selectedDate.value} days before)`,
              sound: true,
              priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: {
              type: SchedulableTriggerInputTypes.DATE,
              date: reminderDate,
            },
          });
          setNotificationId(id);
          Alert.alert(
            'Notification scheduled on',
            reminderDate.toLocaleDateString()
          );
          console.log('Notification scheduled with ID:', id);
        }
      } catch (error) {
        console.error('Error scheduling notification:', error);
        Alert.alert('Error scheduling notification');
      }
    } else {
      Notifications.getAllScheduledNotificationsAsync().then(
        (notifications) => {
          console.log(notifications);
        }
      );
    }
  };

  const handleClose = () => {
    setReminder(false);
    scheduleNotification();
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <Pressable style={styles.container} onPress={handleClose}>
      <View style={styles.innerContainer}>
        <View style={[styles.content, { paddingVertical: 3 }]}>
          <TextInput
            style={styles.label}
            placeholder='Title'
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
        </View>
        <TouchableOpacity
          style={styles.content}
          onPress={() => setPickDate(!pickDate)}
        >
          <Text style={styles.label}>Reminder</Text>
          <Text style={styles.text}>
            {selectedDate ? selectedDate.label : 'None'}
          </Text>
          <View style={styles.icons}>
            <Icon name='chevron-up' size={8} color='gray' />
            <Icon name='chevron-down' size={8} color='gray' />
          </View>
        </TouchableOpacity>
      </View>
      <Modal transparent visible={pickDate}>
        <PickReminderDate
          setPickDate={setPickDate}
          reminderDates={reminderDates}
          setSelectedDate={setSelectedDate}
        />
      </Modal>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 24,
  },
  content: {
    backgroundColor: COLORS['dark-green'],
    borderRadius: 12,
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  label: {
    color: COLORS['dark-text-green'],
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  text: {
    color: 'gray',
    fontSize: 18,
    marginRight: 8,
  },
  icons: {
    justifyContent: 'center',
  },
  innerContainer: {
    backgroundColor: COLORS.bg,
    marginHorizontal: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
});

export default UseNotifications;
