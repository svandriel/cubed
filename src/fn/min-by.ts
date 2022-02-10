import { minWith } from './min-with';

export function minBy<T>(propFn: (item: T) => number | string, list: T[]): T | undefined {
  const compareFn = (a: T, b: T): number => {
    const aResult = propFn(a);
    const bResult = propFn(b);
    if (aResult === bResult) {
      return 0;
    }

    if (typeof aResult === 'number' && typeof bResult === 'number') {
      return aResult - bResult;
    }
    if (typeof aResult === 'string' && typeof bResult === 'string') {
      return aResult < bResult ? -1 : 1;
    }
    throw new Error(
      `Incompatible return values: ${typeof aResult} (${aResult}) vs ${typeof bResult} (${bResult}))`
    );
  };
  return minWith(compareFn, list);
}
