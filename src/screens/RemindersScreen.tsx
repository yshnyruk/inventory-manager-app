import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsStackParamList } from '../navigation/stack/SettingsStackNavigation';
import { FlatList } from 'react-native-gesture-handler';
import SettingsButton from '../components/SettingsButton';
import { COLORS } from '../styles';
import * as Notifications from 'expo-notifications';
import {
  NotificationContent,
  NotificationTrigger,
  SchedulableNotificationTriggerInput,
} from 'expo-notifications';
import Empty from '../components/Empty';
import UseNotifications from '../modals/UseNotifications';

interface ScheduledNotificationItem {
  identifier: string;
  content: NotificationContent;
  trigger?: NotificationTrigger;
}

type Props = StackScreenProps<SettingsStackParamList, 'Reminders'>;

const RemindersScreen = ({ route, navigation }: Props) => {
  const [scheduledNotifications, setScheduledNotifications] = useState<
    ScheduledNotificationItem[]
  >([]);

  const fetchScheduledNotifications = async () => {
    try {
      // Fetch all scheduled notifications
      const notifications =
        await Notifications.getAllScheduledNotificationsAsync();

      // Set the scheduled notifications
      setScheduledNotifications(notifications as ScheduledNotificationItem[]);

      console.log('Fetched notifications:', notifications);
    } catch (error) {
      console.error('Error fetching scheduled notifications:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Cancel the reminder
      await Notifications.cancelScheduledNotificationAsync(id);

      // Update the list of reminders
      const updatedReminders = scheduledNotifications.filter(
        (reminder) => reminder.identifier !== id
      );
      setScheduledNotifications(updatedReminders);
    } catch (error) {
      // Handle the error
      console.error('Error deleting reminder:', error);
    }
  };

  const renderItem = ({ item }: { item: ScheduledNotificationItem }) => {
    return (
      <SettingsButton
        title={item.content.title as string}
        text={item && new Date(item.trigger.value).toLocaleDateString()}
        onDelete={() => handleDelete(item.identifier)}
      />
    );
  };

  useEffect(() => {
    fetchScheduledNotifications();
  }, []);

  return (
    <View style={styles.flexContainer}>
      <Header label='Reminders' navigation={navigation} />
      <View style={styles.container}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={scheduledNotifications}
          renderItem={renderItem}
          ListEmptyComponent={<Empty />}
          ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
          contentContainerStyle={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginHorizontal: 24,
    marginVertical: 12,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: COLORS['dark-text-green'],
  },
  renderContent: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 6,
    borderColor: COLORS['dark-text-green'],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS['light-green'],
  },
});

export default RemindersScreen;
