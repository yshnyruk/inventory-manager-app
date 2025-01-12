function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
}

export function deepCompare(
  obj1: unknown,
  obj2: unknown,
  path: string = ''
): boolean {
  if (obj1 === obj2) {
    return true;
  }

  const type1 = Object.prototype.toString.call(obj1);
  const type2 = Object.prototype.toString.call(obj2);

  if (type1 !== type2) {
    console.log(`[Type mismatch] at path '${path}':`, {
      obj1Type: type1,
      obj2Type: type2,
      obj1Value: obj1,
      obj2Value: obj2,
    });
    return false;
  }

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) {
      console.log(`[Array length mismatch] at path '${path}':`, {
        obj1Length: obj1.length,
        obj2Length: obj2.length,
      });
      return false;
    }

    for (let i = 0; i < obj1.length; i++) {
      const newPath = path ? `${path}[${i}]` : `[${i}]`;
      if (!deepCompare(obj1[i], obj2[i], newPath)) {
        return false;
      }
    }

    return true;
  }

  if (isPlainObject(obj1) && isPlainObject(obj2)) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      console.log(`[Object keys length mismatch] at path '${path}':`, {
        obj1Keys: keys1,
        obj2Keys: keys2,
      });
      return false;
    }

    for (const key of keys1) {
      if (!(key in obj2)) {
        console.log(`[Missing key] '${key}' in obj2 at path '${path}'`);
        return false;
      }
    }

    for (const key of keys1) {
      const newPath = path ? `${path}.${key}` : key;
      if (!deepCompare(obj1[key], obj2[key], newPath)) {
        return false;
      }
    }

    return true;
  }

  console.log(`[Value mismatch] at path '${path}':`, {
    obj1Value: obj1,
    obj2Value: obj2,
  });
  return false;
}
