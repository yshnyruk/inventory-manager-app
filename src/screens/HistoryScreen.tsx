import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { RootDrawerParamList } from '../navigation/DrawerNavigation'
import Icon from 'react-native-vector-icons/FontAwesome';

interface HistoryScreenProps {
  navigation: DrawerNavigationProp<RootDrawerParamList, 'History'>;
}

const HistoryScreen = ({ navigation }: HistoryScreenProps) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>History</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.contentText}>This is your history screen.</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 24, // Adjusted top padding for the header
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 3,
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
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

export default HistoryScreen