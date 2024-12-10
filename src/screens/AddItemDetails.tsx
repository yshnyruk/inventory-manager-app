import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { initDatabase } from '../../db';

export default function AddItemDetails({ navigation }: any) {
    const [item, setItem] = useState({
        name: '',
        category: '',
        number: 1,
        expiryDate: '',
        weightVolumeQuantity: 1,
        additionaInf: '',
    })
    const db = useSQLiteContext();

    const addItem = async ({ item }: any) => {
        try {
            console.log(item);
            const statement = await db.prepareAsync('INSERT INTO Items (name, category, number, expiryDate, weightVolumeQuantity, additionalInfo) VALUES (?, ?, ?, ?, ?, ?)');
            statement.executeAsync([item.name, item.category, item.number, item.expiryDate, item.weightVolumeQuantity, item.additionalInfo]);
        } catch (error) {
            console.log('Error while adding an Items : ', error)
        }
    }

    const handleSave = async () => {
        try {
            await addItem({ item });
            navigation.goBack(); // Navigate back after item is added
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#fff" />
                </Pressable>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Add Item</Text>
                </View>
            </View>

            {/* Content Section */}
            <View style={styles.content}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    onChange={(text) => setItem({ ...item, name: text.nativeEvent.text })} />
                <TextInput
                    style={styles.input}
                    placeholder="Category"
                    onChange={(text) => setItem({ ...item, category: text.nativeEvent.text })} />
                <TextInput
                    style={styles.input}
                    placeholder="Number"
                    keyboardType="numeric"
                    onChange={(text) => setItem({ ...item, number: text.nativeEvent.eventCount })} />
                <TextInput
                    style={styles.input}
                    placeholder="Date of Expiry"
                    onChange={(text) => setItem({ ...item, expiryDate: text.nativeEvent.text })} />
                <TextInput
                    style={styles.input}
                    placeholder="Weight/Quantity/Volume"
                    onChange={(text) => setItem({ ...item, weightVolumeQuantity: text.nativeEvent.eventCount })} />
                <TextInput
                    style={styles.input}
                    placeholder="Additional Information"
                    multiline={true}
                    numberOfLines={3}
                    onChange={(text) => setItem({ ...item, additionaInf: text.nativeEvent.text })} />

                {/* Save Button */}
                <Pressable style={styles.button} onPress={() => 
                    handleSave()
                }>
                    <Text style={styles.buttonText}>Save</Text>
                </Pressable>
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
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
