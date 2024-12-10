import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { styles } from '../styles'

export default function SpaceItem({item} : any) {
  return (
    <Pressable style={styles.spaceItemContainer}>
      <Text style={styles.spaceItemText}>{item.name}</Text>
    </Pressable>
  )
}