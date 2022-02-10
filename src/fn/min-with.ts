export function minWith<T>(compareFn: (a: T, b: T) => number, list: T[]): T | undefined {
  if (list.length === 0) {
    return undefined;
  }
  return list.slice(1).reduce((acc, item) => {
    if (typeof acc === 'undefined') {
      return item;
    }
    return compareFn(item, acc) < 0 ? item : acc;
  }, list[0]);
}
