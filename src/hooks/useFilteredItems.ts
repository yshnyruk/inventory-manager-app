import { useEffect, useState } from 'react';
import { getFromStorage } from '../services/storageService';

export const useItemsAndSpaces = (spaceId: string, isHistory = false) => {
  const [data, setData] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const spaces = await getFromStorage('spaces');
        const items = await getFromStorage('items');
        const filtered = [...spaces, ...items].filter(
          (item) =>
            item.parentId === spaceId &&
            (isHistory
              ? item.activeTo !== undefined
              : item.activeTo === undefined)
        );
        setData(filtered);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [spaceId, isHistory]);

  return { data, loading };
};
