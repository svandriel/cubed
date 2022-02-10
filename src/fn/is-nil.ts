export function isNil<T>(item: T | undefined | null): item is T {
  return item === null || typeof item === 'undefined';
}
