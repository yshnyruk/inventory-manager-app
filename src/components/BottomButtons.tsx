import { memo } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS, SHADOWS } from '../styles';

const BottomButtons = memo(({ onAddSpace, onAddItem }: any) => (
  <View style={styles.bottomButtonsContainer}>
    <Pressable style={styles.iconContainer} onPress={onAddSpace}>
      <Icon
        style={styles.icon}
        name='folder'
        size={24}
        color={COLORS['dark-text-green']}
      />
    </Pressable>
    <Pressable style={styles.iconContainer} onPress={onAddItem}>
      <Icon
        style={styles.icon}
        name='plus'
        size={24}
        color={COLORS['dark-text-green']}
      />
      <Text style={styles.addItemText}>Add Item</Text>
    </Pressable>
  </View>
));

const styles = StyleSheet.create({
  icon: {
    paddingLeft: 6,
    width: 36,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bg,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  iconContainer: {
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    backgroundColor: COLORS['light-green'],
    borderRadius: 12,
    ...SHADOWS.medium,
  },

  addItemText: {
    color: COLORS['dark-text-green'],
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default BottomButtons;
