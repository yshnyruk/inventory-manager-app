import { useNavigation } from '@react-navigation/native';
import React, { memo, useState, useEffect } from 'react';
import { View, Pressable, Text } from 'react-native';
import { styles } from '../styles';
import { Space } from '../screens/HomeScreen';
import { HomeScreenProps } from '../screens/HomeScreen';

// Memoized component to optimize performance
const Link = memo(({ id, spaces }: { id: string; spaces: Space[] }) => {
  // Using navigation hook to navigate between screens
  const navigation = useNavigation<HomeScreenProps['navigation']>();
  // State to hold the path of spaces
  const [path, setPath] = useState<Array<{ id: string; name: string }>>([]);

  // Effect to build the path of spaces when the component mounts or spaces change
  useEffect(() => {
    const buildPath = (currentId: string) => {
      const result = [];
      let current = currentId;
      // Loop to build the path from the current space to the root
      while (current !== 'Root') {
        const space = spaces.find((s: any) => s.id === current);
        if (space) {
          // Prepending the current space to the result array
          result.unshift({ id: space.id, name: space.name });
          current = space.parentId;
        } else break;
      }
      // Updating the state with the built path
      setPath(result);
    };

    buildPath(id);
  }, [id, spaces]);

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

export default Link;
