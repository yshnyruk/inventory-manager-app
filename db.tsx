import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';

interface Space {
    id: number;
    name: string;
    parentId?: number; // Optional if the space is top-level
}

export const spaceList = () => {
    const [spaces, setSpaces] = useState<Space[]>([]);

    useEffect(() => {
        const loadSpaces = async () => {
            try {
                const data = await selectAll();
                setSpaces(data); // Set fetched data to state
            } catch (error) {
                console.error('Error loading spaces:', error);
            }
        };
        loadSpaces();
    }, []); // Empty dependency array makes it run only once on mount

    const handleAddSpaces = async (name : string) => {
        const db = await SQLite.openDatabaseAsync('app.db');

        const result = await db.runAsync('INSERT INTO Spaces (name) VALUES (?)', name);
        const updatedSpaces = await selectAll();
        setSpaces(updatedSpaces)

        console.log('handleAddSpaces: ', result)
    }
    return {
        spaces,
        handleAddSpaces
    };
}

export const setupDatabase = async () => {
    const db = await SQLite.openDatabaseAsync('app.db');

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
            spaceId INTEGER NOT NULL,
            number INTEGER DEFAULT 1,
            expiryDate TEXT,
            weightVolumeQuantity TEXT,
            additionalInfo TEXT CHECK(LENGTH(additionalInfo) <= 250),
            FOREIGN KEY (spaceId) REFERENCES Spaces(id) ON DELETE CASCADE
        );`
    );

    console.log('Database created')
};

export const selectAll = async () => {
    const db = await SQLite.openDatabaseAsync('app.db');

    const allRows: Array<{ id: number; name: string; parentId: number }> = await db.getAllAsync('Select * from Spaces;');
    return allRows
}

export const dropTable = async () => {
    const db = await SQLite.openDatabaseAsync('app.db');

    const result = await db.runAsync('drop table Spaces;');
    console.log(result);
}