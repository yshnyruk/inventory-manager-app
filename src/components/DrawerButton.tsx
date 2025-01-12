import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '../styles';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

type Props = {
  onPress: () => void;
  label: string;
  iconName?: string;
};

const DrawerButton = ({ onPress, label, iconName }: Props) => {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        {iconName && <Icon name={iconName} size={24} color='#1C1B1F' />}
        <Text style={styles.text}>{label}</Text>
        <Icon name='chevron-right' size={12} color='#1C1B1F' />
      </View>
      <View style={styles.divider} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
    gap: 8,
    alignItems: 'center',
  },
  divider: {
    marginTop: 3,
    height: 1,
    backgroundColor: COLORS.divider,
    width: '100%',
  },
  text: {
    fontSize: 16,
    fontWeight: 500,
    flex: 1,
  },
});

export default DrawerButton;
