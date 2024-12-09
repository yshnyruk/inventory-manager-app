import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RootDrawerParamList } from '../navigation/DrawerNavigation';
import { selectAll, spaceList, dropTable } from '../../db';

interface HomeScreenProps {
  navigation: DrawerNavigationProp<RootDrawerParamList, 'Home'>;
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [spaceName, setSpaceName] = useState('');
  const { spaces, handleAddSpaces } = spaceList();

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="bars" size={24} color="#000" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          placeholderTextColor="#999"
        />
      </View>

      {/* List of Items */}
      <FlatList
        data={spaces}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>{item.name}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.button} onPress={() => console.log(spaces)}>
          <Text style={styles.buttonText}>Initialize DB</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Add Space</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Select Spaces</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => dropTable()}>
          <Text style={styles.buttonText}>Drop Table</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Popup */}
      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Name Your Space</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter space name"
              value={spaceName}
              onChangeText={setSpaceName}
            />
            <View style={styles.buttonRow}>
              <Button title="Close" onPress={() => {
                setModalVisible(false);
                setSpaceName('')
              }} />
              <Button
                title="Create"
                onPress={() => {
                  handleAddSpaces(spaceName); 
                  setModalVisible(false); 
                  setSpaceName('')
                }}
                disabled={spaceName.trim().length === 0}
              />
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    backgroundColor: '#f8f8f8',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  searchBar: {
    flex: 1,
    marginLeft: 10,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#e6e6e6',
    paddingHorizontal: 10,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  listItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    elevation: 1,
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: '#fff',
    elevation: 2,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0,)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export default HomeScreen;