import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item, Space } from '../screens/HomeScreen';

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

export const deleteCasc = async (spaceId: string) => {
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
    await setData('items', updatedItems);
  } catch (error) {
    console.error('Failed to delete item:', error);
  }
};

export const deleteOne = async (id: string, key: string) => {
  const data = await getData(key);
  const updatedData = data.filter((e: Item | Space) => e.id !== id);
  await setData(key, updatedData);
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

export const toHistoryCasc = async (spaceId: string) => {
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
        ? { ...space, activeTo: new Date() }
        : space
    );
    await setData('spaces', updatedSpaces);

    const updatedItems = items.map((item: Item) =>
      spacesToUpdate.includes(item.parentId)
        ? { ...item, activeTo: new Date() }
        : item
    );
    await setData('items', updatedItems);
  } catch (error) {
    console.error('Failed to update history:', error);
  }
};

export const toHistory = async (id: string, key: string) => {
  const data: (Item | Space)[] = await getData(key);
  const updatedData = data.map((item: any) =>
    item.id === id ? { ...item, activeTo: new Date() } : item
  );
  await setData(key, updatedData);
};

export const restore = async (id: string, type: 'items' | 'spaces') => {
  const data = await getData(type);
  const updatedData = data.map((item: any) =>
    item.id === id ? { ...item, activeTo: undefined } : item
  );
  await setData(type, updatedData);
  return true;
};

export const restoreCasc = async (id: string) => {
  const spaces = await getData('spaces');
  const items = await getData('items');

  const getChildren = (parentId: string) => {
    return spaces.filter((space: any) => space.parentId === parentId);
  };

  const restoreSpaceAndChildren = async (parentId: string) => {
    await restore(parentId, 'spaces');

    const children = getChildren(parentId);
    for (const child of children) {
      await restoreSpaceAndChildren(child.id);
    }

    const relatedItems = items.filter(
      (item: any) => item.parentId === parentId
    );
    for (const item of relatedItems) {
      await restore(item.id, 'items');
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
