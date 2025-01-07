import { useNavigation } from '@react-navigation/native';
import React, { memo, useState, useEffect } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Space } from '../screens/HomeScreen';
import { HomeScreenProps } from '../screens/HomeScreen';
import { buildPath } from '../utils';
import { getData } from '../services';

const Link = memo(({ id }: { id: string }) => {
  const navigation = useNavigation<HomeScreenProps['navigation']>();
  const [path, setPath] = useState<Array<{ id: string; name: string }>>([]);

  // Effect to build the path of spaces when the component mounts or spaces change
  useEffect(() => {
    const loadLink = async () => {
      const spaces = await getData('spaces');
      const pathRes = buildPath(id, spaces);
      setPath(pathRes);
    };

    loadLink();
  }, [id]);

  // Function to handle navigation when a path item is clicked
  const handlePathClick = (pathId: string) => {
    if (pathId === 'Root') {
      navigation.navigate('Home', { parentId: 'Root' });
    } else {
      navigation.navigate('Home', { parentId: pathId });
    }
  };

  return (
    <View style={styles.link}>
      <Pressable onPress={() => handlePathClick('Root')}>
        <Text style={styles.pathLink}>Home</Text>
      </Pressable>
      {path.map((item) => (
        <React.Fragment key={item.id}>
          <Text>{' > '}</Text>
          <Pressable onPress={() => handlePathClick(item.id)}>
            <Text style={styles.pathLink}>{item.name}</Text>
          </Pressable>
        </React.Fragment>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  pathLink: {
    color: '#65558F',
    textDecorationLine: 'underline',
  },
});

export default Link;
