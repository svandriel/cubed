import { minBy } from './min-by';

describe('minBy', () => {
  it('works', () => {
    const users = [
      {
        name: 'Bob',
        age: 21,
      },
      {
        name: 'Alice',
        age: 20,
      },
      {
        name: 'Charlotte',
        age: 19,
      },
    ];

    expect(minBy(a => a.age, users)).toEqual({
      name: 'Charlotte',
      age: 19,
    });
  });

  it('works with string', () => {
    const users = [
      {
        name: 'Bob',
        age: 21,
      },
      {
        name: 'Alice',
        age: 20,
      },
      {
        name: 'Charlotte',
        age: 19,
      },
    ];

    expect(minBy(a => a.name, users)).toEqual({
      name: 'Alice',
      age: 20,
    });
  });

  it('works with empty list', () => {
    const compareNumbers = (a: number): number => a;
    expect(minBy(compareNumbers, [])).toBeUndefined();
  });
});
