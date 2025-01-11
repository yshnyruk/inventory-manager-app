import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS, SHADOWS } from '../styles';

type Props = {
  text?: string;
  icon?: string;
  onPress?: () => void;
};

const EditButton = ({ text, icon, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.content} onPress={onPress}>
      {text && <Text style={styles.text}>{text}</Text>}
      {icon && <Icon name={icon} size={20} color={COLORS['dark-text-green']} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  content: {
    borderRadius: 24,
    backgroundColor: COLORS['dark-green'],
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 12,
    alignSelf: 'flex-start',
    ...SHADOWS.light,
  },
  text: {
    color: COLORS['dark-text-green'],
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditButton;
