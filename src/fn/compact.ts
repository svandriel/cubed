import { isNil } from './is-nil';

export function compact<T>(list: Array<T | null | undefined>): T[] {
  return list.filter(item => !isNil(item)) as T[];
}
