import { isNil } from './is-nil';

export function memo<T, U>(fn: (arg: T) => U): (arg: T) => U {
  const cache: Map<string, U> = new Map();
  return (arg: T): U => {
    const cacheKey = JSON.stringify(arg);
    const found = cache.get(cacheKey);
    if (!isNil(found)) {
      return found;
    }
    const result = fn(arg);
    cache.set(cacheKey, result);
    return result;
  };
}
