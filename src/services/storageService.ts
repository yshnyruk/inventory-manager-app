import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item, Space } from '../screens/HomeScreen';
import { User } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { db } from './firebase';

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return [];
  }
};

export const setData = async (key: string, items: any[]) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
};

export const getItem = async (id: string, type: string) => {
  try {
    const data = await getData(type);
    return data.find((item: { id: string }) => item.id === id) || 'null';
  } catch (error) {
    console.error('Failed to get item:', error);
    return null;
  }
};

export const setItem = async (id: string, updatedItem: Item, type: string) => {
  try {
    const data = await getData(type);
    const index = data.findIndex((item: { id: string }) => item.id === id);

    if (index !== -1) {
      data[index] = updatedItem;
      await setData(type, data);
    }
  } catch (error) {
    console.error('Failed to set item:', error);
  }
};

export const deleteCasc = async (spaceId: string, user: User | null) => {
  try {
    const spaces = await getData('spaces');
    const items = await getData('items');

    const findChildSpaces = (id: string): Space[] => {
      const childSpaces = spaces.filter((e: Space) => e.parentId === id);
      return childSpaces.reduce(
        (acc: Space[], space: Space) => [
          ...acc,
          space,
          ...findChildSpaces(space.id),
        ],
        []
      );
    };

    const spacesToDelete = [
      spaceId,
      ...findChildSpaces(spaceId).map((p) => p.id),
    ];

    const updatedSpaces = spaces.filter(
      (e: Space) => !spacesToDelete.includes(e.id)
    );
    await setData('spaces', updatedSpaces);

    const updatedItems = items.filter(
      (item: Item) => !spacesToDelete.includes(item.parentId)
    );

    if (null !== user) {
      const spacesRef = ref(db, `users/${user.uid}/spaces`);
      const itemsRef = ref(db, `users/${user.uid}/items`);
      await set(itemsRef, updatedItems);
      await set(spacesRef, updatedSpaces);
    }
    await setData('items', updatedItems);
  } catch (error) {
    console.error('Failed to delete item:', error);
  }
};

export const deleteOne = async (id: string, key: string, user: User | null) => {
  const data = await getData(key);
  const updatedData = data.filter((e: Item | Space) => e.id !== id);
  await setData(key, updatedData);
  if (null !== user) {
    const userRef = ref(db, `users/${user.uid}/${key}`);
    await set(userRef, updatedData);
  }
};

export const hasChildren = async (spaceId: string): Promise<boolean> => {
  const spaces = await getData('spaces');
  const items = await getData('items');

  const hasChildPlaces = spaces.some(
    (space: Space) => space.parentId === spaceId
  );
  const hasItems = items.some((item: Item) => item.parentId === spaceId);
  return hasChildPlaces || hasItems;
};

export const toHistoryCasc = async (spaceId: string, user: User | null) => {
  try {
    const spaces = await getData('spaces');
    const items = await getData('items');

    const findChildSpaces = (id: string): Space[] => {
      const childSpaces = spaces.filter((e: Space) => e.parentId === id);
      return childSpaces.reduce(
        (acc: Space[], space: Space) => [
          ...acc,
          space,
          ...findChildSpaces(space.id),
        ],
        []
      );
    };

    const spacesToUpdate = [
      spaceId,
      ...findChildSpaces(spaceId).map((p) => p.id),
    ];

    const updatedSpaces = spaces.map((space: Space) =>
      spacesToUpdate.includes(space.id)
        ? { ...space, activeTo: new Date().toISOString() }
        : space
    );
    await setData('spaces', updatedSpaces);

    const updatedItems = items.map((item: Item) =>
      spacesToUpdate.includes(item.parentId)
        ? { ...item, activeTo: new Date().toISOString() }
        : item
    );
    await setData('items', updatedItems);

    if (null !== user) {
      const spacesRef = ref(db, `users/${user.uid}/spaces`);
      const itemsRef = ref(db, `users/${user.uid}/items`);
      await set(itemsRef, updatedItems);
      await set(spacesRef, updatedSpaces);
    }
    return { updatedSpaces, updatedItems };
  } catch (error) {
    console.error('Failed to update history:', error);
    return {};
  }
};

export const toHistory = async (id: string, key: string, user: User | null) => {
  const data: (Item | Space)[] = await getData(key);
  const updatedData = data.map((item: any) =>
    item.id === id ? { ...item, activeTo: new Date().toISOString() } : item
  );
  await setData(key, updatedData);
  if (null !== user) {
    const userRef = ref(db, `users/${user.uid}/${key}`);
    await set(userRef, updatedData);
  }
};

export const restore = async (
  id: string,
  type: 'items' | 'spaces',
  user: User | null
) => {
  const data = await getData(type);
  const updatedData = data.map((item: any) =>
    item.id === id ? { ...item, activeTo: null } : item
  );
  await setData(type, updatedData);
  if (null !== user) {
    const userRef = ref(db, `users/${user.uid}/${type}`);
    await set(userRef, updatedData);
  }
  return true;
};

export const restoreCasc = async (id: string, user: User | null) => {
  const spaces = await getData('spaces');
  const items = await getData('items');

  const getChildren = (parentId: string) => {
    return spaces.filter((space: any) => space.parentId === parentId);
  };

  const restoreSpaceAndChildren = async (parentId: string) => {
    await restore(parentId, 'spaces', user);

    const children = getChildren(parentId);
    for (const child of children) {
      await restoreSpaceAndChildren(child.id);
    }

    const relatedItems = items.filter(
      (item: any) => item.parentId === parentId
    );
    for (const item of relatedItems) {
      await restore(item.id, 'items', user);
    }
  };

  await restoreSpaceAndChildren(id);
  return true;
};

export const updateObject = async (
  id: string,
  updatedObject: Partial<Item | Space>,
  type: 'items' | 'spaces'
) => {
  try {
    const data: (Item | Space)[] = await getData(type);
    const index = data.findIndex((obj) => obj.id === id);

    if (index !== -1) {
      data[index] = { ...data[index], ...updatedObject };
      await setData(type, data);

      console.log(`Object with ID ${id} updated successfully.`);
    } else {
      console.warn(`Object with ID ${id} not found.`);
    }
  } catch (error) {
    console.error('Failed to update object:', error);
  }
};
