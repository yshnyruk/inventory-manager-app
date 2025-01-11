import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ListRenderItem,
  ListRenderItemInfo,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { COLORS, SHADOWS } from '../styles/theme';
import { FlatList } from 'react-native-gesture-handler';
import { ReminderDate } from './UseNotifications';

type Props = {
  reminderDates: ReminderDate[];
  setPickDate: (reminder: boolean) => void;
  setSelectedDate: (date: ReminderDate) => void;
};

const pickReminderDate = ({
  reminderDates,
  setPickDate,
  setSelectedDate,
}: Props) => {
  const handlePickDate = (date: ReminderDate) => {
    setSelectedDate(date);
    setPickDate(false);
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: ReminderDate;
    index: number;
  }) => (
    <TouchableOpacity
      onPress={() => handlePickDate(item)}
      style={[
        styles.renderItemContent,
        index === reminderDates.length && { borderBottomWidth: 0 },
      ]}
    >
      <Text style={styles.renderItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <Pressable style={styles.container} onPress={() => setPickDate(false)}>
      <Pressable style={styles.content}>
        <FlatList
          keyExtractor={(item) => item.label}
          data={[...reminderDates, { label: 'None', value: NaN }]}
          renderItem={renderItem}
        />
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flex: 1,
  },
  content: {
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    bottom: 48,
    right: 48,
    position: 'absolute',
    ...SHADOWS.medium,
  },
  renderItemContent: {
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderBottomWidth: 0.2,
    borderColor: 'gray',
  },
  renderItemText: {
    fontSize: 16,
  },
});
export default pickReminderDate;
