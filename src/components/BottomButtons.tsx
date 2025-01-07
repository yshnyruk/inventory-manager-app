import { memo } from 'react';
import { View, Pressable, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles, COLORS } from '../styles';

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

export default BottomButtons;
