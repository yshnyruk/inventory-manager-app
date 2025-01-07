import { memo } from 'react';
import { View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../styles';

const Search = memo(({ search, setSearch, navigation }: any) => (
  <View style={styles.headerContainer}>
    <Icon
      style={styles.icon}
      onPress={() => navigation.openDrawer()}
      name='bars'
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
));

export default Search;
