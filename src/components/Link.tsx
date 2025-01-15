import {
  CompositeScreenProps,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import React, { memo, useState, useEffect } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Space } from '../screens/HomeScreen';
import { HomeScreenProps } from '../screens/HomeScreen';
import { buildPath } from '../utils';
import { HistoryScreenProps } from '../screens/HistoryScreen';
import { getFromStorage } from '../services/storageService';

type Props = CompositeScreenProps<HistoryScreenProps, HomeScreenProps>;

const Link = memo(
  ({
    id,
    initialRoute,
    navigationStr,
  }: {
    id: string;
    initialRoute: string;
    navigationStr: string;
  }) => {
    const navigation = useNavigation<Props['navigation']>();
    const [path, setPath] = useState<Array<{ id: string; name: string }>>([]);

    // Effect to build the path of spaces when the component mounts or spaces change
    useEffect(() => {
      const loadLink = async () => {
        const spaces = await getFromStorage('spaces');
        const pathRes = buildPath(id, spaces);
        setPath(pathRes);
      };

      loadLink();
    }, [id]);

    // Function to handle navigation when a path item is clicked
    const handlePathClick = (pathId: string) => {
      const screen = navigationStr === 'Home' ? 'Home' : 'HistoryMain';
      const params = { parentId: pathId === 'Root' ? 'Root' : pathId };

      const pushAction = StackActions.push(screen, params);
      navigation.dispatch(pushAction);
    };

    return (
      <View style={styles.link}>
        <Pressable onPress={() => handlePathClick('Root')}>
          <Text style={styles.pathLink}>{initialRoute}</Text>
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
  }
);

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
