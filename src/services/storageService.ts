import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item } from '../screens/HomeScreen';

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

export const deleteItemCasc = async (
  itemId: string,
  type: string,
  onDeleteSuccess: () => {}
) => {
  const storageKey = type === 'space' ? 'spaces' : 'items';

  try {
    const data = await AsyncStorage.getItem(storageKey);

    if (data) {
      const items = JSON.parse(data) as Array<{
        id: string;
        parentId?: string;
      }>;
      const getChildrenIds = (
        parentId: string,
        items: Array<{ id: string; parentId?: string }>
      ) => {
        const children = items.filter((item) => item.parentId === parentId);
        let allChildrenIds = children.map((child) => child.id);

        children.forEach((child) => {
          allChildrenIds = allChildrenIds.concat(
            getChildrenIds(child.id, items)
          );
        });

        return allChildrenIds;
      };
      const idsToDelete =
        type === 'space'
          ? [itemId, ...getChildrenIds(itemId, items)]
          : [itemId];
      const updatedItems = items.filter(
        (item) => !idsToDelete.includes(item.id)
      );
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedItems));

      console.log(`${type} with ID ${itemId} and its children were deleted.`);
      onDeleteSuccess();
    }
  } catch (error) {
    console.error('Failed to delete item:', error);
  }
};
