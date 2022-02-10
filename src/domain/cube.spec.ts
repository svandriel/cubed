import { Cube } from './cube';

describe('cube', () => {
  it('works', () => {
    const cube = new Cube();
    expect(cube).toMatchSnapshot();
  });
});
