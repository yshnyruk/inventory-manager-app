import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS } from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';

type Props = {
  title: string;
  icon?: string;
  text?: string;
  onPress?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
};

const SettingsButton = ({
  title,
  icon,
  text,
  onPress,
  onDelete,
  onEdit,
}: Props) => {
  return (
    <TouchableOpacity
      style={styles.content}
      onPress={onPress}
      activeOpacity={onPress ? 0 : 1}
    >
      {icon && <Icon name={icon} size={24} color={COLORS['dark-text-green']} />}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
      {onPress && (
        <Icon
          name='chevron-right'
          size={14}
          color={COLORS['dark-text-green']}
        />
      )}
      {onEdit && (
        <TouchableOpacity onPress={onEdit}>
          <Icon name='pencil' size={24} color={COLORS['dark-text-green']} />
        </TouchableOpacity>
      )}
      {onDelete && (
        <TouchableOpacity onPress={onDelete}>
          <Icon name='trash' size={24} color={COLORS['dark-text-green']} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    backgroundColor: COLORS['light-green'],
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  title: {
    fontSize: 16,
  },
  textContainer: {
    flex: 1,
  },
  text: {},
});

export default SettingsButton;
