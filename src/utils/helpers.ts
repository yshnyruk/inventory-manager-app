export const hasActiveParent = (id: string, items: any[]): boolean => {
  const parent = items.find((item) => item.id === id);
  if (!parent) return false;
  if (parent.activeTo === undefined) return true;
  return hasActiveParent(parent.parentId, items);
};
