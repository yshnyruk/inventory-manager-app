import { memo } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS, SHADOWS } from '../styles';

const Search = memo(({ search, setSearch, navigation, leftIcon }: any) => {
  const leftIconOnPress = () => {
    if (leftIcon === 'bars') {
      navigation.openDrawer();
    } else {
      navigation.navigate('HomeStack', { screen: 'Home' });
    }
  };

  return (
    <View style={styles.headerContainer}>
      <Icon
        style={styles.icon}
        onPress={leftIconOnPress}
        name={leftIcon}
        size={24}
        color='#49454F'
      />
      <TextInput
        placeholder='Search...'
        style={styles.input}
        value={search}
        onChangeText={setSearch}
      />
      <Icon
        style={styles.icon}
        onPress={() => {}}
        name='search'
        size={24}
        color='#49454F'
      />
    </View>
  );
});

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: COLORS['light-green'],
    ...SHADOWS.light,
  },
  icon: {
    paddingLeft: 6,
    width: 36,
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: COLORS['input-text'],
  },
});

export default Search;
