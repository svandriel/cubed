import { minWith } from './min-with';

describe('minWith', () => {
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

    expect(minWith((a, b) => a.age - b.age, users)).toEqual({
      name: 'Charlotte',
      age: 19,
    });
  });

  it('works with empty list', () => {
    const compareNumbers = (a: number, b: number): number => a - b;
    expect(minWith(compareNumbers, [])).toBeUndefined();
  });
});
