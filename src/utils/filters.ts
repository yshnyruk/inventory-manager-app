import { hasActiveParent } from './helpers';

export const filterSpaces = (
  spaces: any[],
  search: string,
  currentSpaceId: string
): any[] => {
  const lowerSearch = search.toLowerCase();
  return spaces.filter(
    (space) =>
      space.activeTo !== null &&
      space.name.toLowerCase().includes(lowerSearch) &&
      (space.parentId === currentSpaceId ||
        hasActiveParent(space.parentId, spaces))
  );
};

export const filterItems = (
  items: any[],
  search: string,
  currentSpaceId: string,
  spaces: any[]
): any[] => {
  const lowerSearch = search.toLowerCase();
  return items.filter(
    (item) =>
      item.activeTo !== null &&
      item.name.toLowerCase().includes(lowerSearch) &&
      (item.parentId === currentSpaceId ||
        hasActiveParent(item.parentId, spaces))
  );
};
