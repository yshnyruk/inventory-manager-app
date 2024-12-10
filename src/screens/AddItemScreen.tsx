import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { initDatabase } from '../../db';
import AddItemDetails from './AddItemDetails';

export default function AddItemScreen({ navigation }: any) {
  return (
      <AddItemDetails navigation={navigation}/>
  )
}

