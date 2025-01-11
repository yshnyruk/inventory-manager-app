import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const Empty = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Empty</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'gray',
  },
});
export default Empty;
