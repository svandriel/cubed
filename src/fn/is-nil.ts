export function isNil<T>(item: T | undefined | null): item is undefined | null {
  return item === null || typeof item === 'undefined';
}
