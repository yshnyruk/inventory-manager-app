import { Space } from '../screens/HomeScreen';

export const buildPath = (currentId: string, spaces: Space[]) => {
  const result = [];
  let current = currentId;
  while (current !== 'Root') {
    const space = spaces.find((s) => s.id === current);
    if (space) {
      result.unshift({ id: space.id, name: space.name });
      current = space.parentId;
    } else break;
  }
  return result;
};
