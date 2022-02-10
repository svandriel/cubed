import { CubeColor, cubeColorsBySide } from './cube-part-color';
import { CubePartType } from './cube-part-type';
import { Direction } from './direction';

export interface CubePart {
  id: number;
  x: number;
  y: number;
  z: number;
  type: CubePartType;
  /**
   * Color order:
   * posx (left), negx (right), posy (top), negy (bottom), posz (front), negz (back)
   */
  colors: [CubeColor, CubeColor, CubeColor, CubeColor, CubeColor, CubeColor];
}

export const COLOR_INDEX_LEFT = 0;
export const COLOR_INDEX_RIGHT = 1;
export const COLOR_INDEX_TOP = 2;
export const COLOR_INDEX_BOTTOM = 3;
export const COLOR_INDEX_FRONT = 4;
export const COLOR_INDEX_BACK = 5;

let counter = 0;

export function createCubePart(x: number, y: number, z: number): CubePart {
  const isLeft = x === -1;
  const isRight = x === 1;
  const isTop = y === 1;
  const isBottom = y === -1;
  const isFront = z === -1;
  const isBack = z === 1;
  const isEdge = x === 0 || y === 0 || z === 0;
  const isMiddle = [x === 0, y === 0, z === 0].filter(p => !!p).length === 2;
  // eslint-disable-next-line no-nested-ternary
  const type = isMiddle ? CubePartType.Middle : isEdge ? CubePartType.Edge : CubePartType.Corner;
  counter += 1;
  const id = counter;
  return {
    id,
    x,
    y,
    z,
    type,
    colors: [
      isRight ? cubeColorsBySide[Direction.PosX] : CubeColor.Inside,
      isLeft ? cubeColorsBySide[Direction.NegX] : CubeColor.Inside,
      isTop ? cubeColorsBySide[Direction.PosY] : CubeColor.Inside,
      isBottom ? cubeColorsBySide[Direction.NegY] : CubeColor.Inside,
      isBack ? cubeColorsBySide[Direction.NegZ] : CubeColor.Inside,
      isFront ? cubeColorsBySide[Direction.PosZ] : CubeColor.Inside,
    ],
  };
}

export function cubePartToString(part: CubePart): string {
  return `(${part.x}, ${part.y}, ${part.z}): ${part.type}: ${part.colors.filter(
    color => color !== CubeColor.Inside
  )}`;
}
