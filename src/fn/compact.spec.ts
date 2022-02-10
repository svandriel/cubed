import { compact } from './compact';

describe('compact', () => {
  it('filters out null and undefined values', () => {
    const list = [1, 2, undefined, 3, '', null, 'w00t'];
    expect(compact(list)).toEqual([1, 2, 3, '', 'w00t']);
  });
});
