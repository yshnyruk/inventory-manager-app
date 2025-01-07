import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../styles';

interface Props {
  label: string;
  navigation: any;
}

const Header = ({ label, navigation }: Props) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name='arrow-left' size={24} color={COLORS['dark-text-green']} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 24, // Adjusted top padding for the header
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS['light-green'],
    paddingVertical: 12,
    paddingHorizontal: 15,
    elevation: 3,
    height: 112,
  },
  backButton: {
    width: 30,
    height: 36,
    alignItems: 'center',
    position: 'absolute',
    margin: 12,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: COLORS['dark-text-green'],
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
});

export default Header;
