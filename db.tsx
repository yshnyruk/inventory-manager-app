import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Modal,
    TextInput,
    Button
} from 'react-native';
import SpaceItem from './src/components/SpaceItem';

interface Space {
    id: number;
    name: string;
    parentId?: number; // Optional if the space is top-level
}

export const initDatabase = async (db: any) => {
    try {
        await db.execAsync(
            `CREATE TABLE IF NOT EXISTS Spaces (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            parentId INTEGER DEFAULT NULL,
            FOREIGN KEY (parentId) REFERENCES Spaces(id) ON DELETE CASCADE
        );`
        )
        await db.execAsync(
            `CREATE TABLE IF NOT EXISTS Items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            spaceId INTEGER DEFAULT NULL,
            number INTEGER DEFAULT 1,
            expiryDate TEXT,
            weightVolumeQuantity TEXT,
            additionalInfo TEXT CHECK(LENGTH(additionalInfo) <= 250),
            FOREIGN KEY (spaceId) REFERENCES Spaces(id) ON DELETE CASCADE
        );`
        );
        console.log('Database created')
    } catch (error) {
        console.log('Error while initializing Database : ', error)
    }
};

export const Content = ({ navigation }: any) => {
    const [spaces, setSpaces] = useState<any[]>([]);
    const [items, setItems] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [spaceName, setSpaceName] = useState('');
    const db = useSQLiteContext()

    const getSpaces = async () => {
        try {
            const allRows = await db.getAllAsync('Select * from Spaces;');
            setSpaces(allRows);
        } catch (error) {
            console.log('Error while getting Spaces : ', error)
        }
    }

    const getItems = async () => {
        try {
            const allRows = await db.getAllAsync('Select * from Items;');
            setItems(allRows);
        } catch (error) {
            console.log('Error while getting Items : ', error)
        }
    }

    const deleteSpaces = async () => {
        try {
            await db.runAsync('DELETE FROM Spaces')
            await getSpaces()
        } catch (error) {
            console.log('Error while deleting all Spaces : ', error)
        }
    }

    const addSpace = async (name: string) => {
        try {
            console.log(name); 
            const statement = await db.prepareAsync('INSERT INTO Spaces (name) VALUES (?)');
            statement.executeAsync([name]);
            await getSpaces()
        } catch (error) {
            console.log('Error while adding a Space : ', error)
        }
    }

    useEffect(() => {
        getItems();
        getSpaces();
    }, []);

    return (
        <View style={styles.flexContainer}>
            <View style={styles.listContainer}>
                {
                    spaces.length === 0 ? (
                        <Text style={styles.emptyText}>It is empty here...</Text>
                    ) : (
                        <View>
                            <FlatList
                                data={spaces}
                                renderItem={({ item }) => (
                                    <SpaceItem item={item} />
                                )}
                            />
                            <FlatList
                                data={items}
                                renderItem={({ item }) => (
                                    <Text style={styles.text}>{item.name}</Text>
                                )}
                            />
                        </View>
                    )
                }
            </View>

            {/* Bottom Buttons */}
            <View style={styles.bottomButtons}>
                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>Add Space</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => deleteSpaces()}>
                    <Text style={styles.buttonText}>Delete From Spaces</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddItemScreen')}>
                    <Text style={styles.buttonText}>Add Item</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => { }}>
                    <Text style={styles.buttonText}>Delete From Items</Text>
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
                                    addSpace(spaceName);
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
    flexContainer: {
        flex: 1,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
        fontWeight: '400'
    },
    listContainer: {
        flex: 1,
        margin: 10
    },
    text: {
        fontSize: 32
    }
});