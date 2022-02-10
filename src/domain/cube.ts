import { range } from '../fn/range';
import { Axis } from './axis';
import { createCubePart, CubePart, cubePartToString } from './cube-part';
import { Direction } from './direction';
import { CubeRotateMove, CubeTurnMove } from './move';

export class Cube {
  readonly parts: CubePart[];

  constructor() {
    const coordinates = range(-1, 1)
      .flatMap(x => range(-1, 1).map(y => [x, y]))
      .flatMap(([x, y]) => range(-1, 1).map(z => [x, y, z]));

    this.parts = coordinates.map(([x, y, z]) => createCubePart(x, y, z));
  }

  getPartsOnSide(side: Direction): CubePart[] {
    const sideFilter = makeSideFilter(side);
    return this.parts.filter(sideFilter);
  }

  rotate(move: CubeRotateMove): void {
    const { parts } = this;
    switch (move.axisName) {
      case Axis.X:
        parts.map(rotateAroundX);
        if (move.clockwise) {
          parts.map(rotateAroundX);
          parts.map(rotateAroundX);
        }
        break;
      case Axis.Y:
        parts.map(rotateAroundY);
        if (!move.clockwise) {
          parts.map(rotateAroundY);
          parts.map(rotateAroundY);
        }
        break;
      case Axis.Z:
        parts.map(rotateAroundZ);
        if (move.clockwise) {
          parts.map(rotateAroundZ);
          parts.map(rotateAroundZ);
        }
        break;
      default:
        throw new Error(`Invalid axis: ${move.axisName}`);
    }
  }

  turn(move: CubeTurnMove): void {
    const sideParts = this.getPartsOnSide(move.side);

    switch (move.side) {
      case Direction.NegX:
        sideParts.map(rotateAroundX);
        if (move.clockwise) {
          sideParts.map(rotateAroundX);
          sideParts.map(rotateAroundX);
        }
        break;
      case Direction.PosX:
        sideParts.map(rotateAroundX);
        if (!move.clockwise) {
          sideParts.map(rotateAroundX);
          sideParts.map(rotateAroundX);
        }
        break;
      case Direction.PosY:
        sideParts.map(rotateAroundY);
        if (move.clockwise) {
          sideParts.map(rotateAroundY);
          sideParts.map(rotateAroundY);
        }
        break;
      case Direction.NegY:
        sideParts.map(rotateAroundY);
        if (!move.clockwise) {
          sideParts.map(rotateAroundY);
          sideParts.map(rotateAroundY);
        }
        break;
      case Direction.PosZ:
        sideParts.map(rotateAroundZ);
        if (!move.clockwise) {
          sideParts.map(rotateAroundZ);
          sideParts.map(rotateAroundZ);
        }
        break;
      case Direction.NegZ:
        sideParts.map(rotateAroundZ);
        if (move.clockwise) {
          sideParts.map(rotateAroundZ);
          sideParts.map(rotateAroundZ);
        }
        break;
      default:
        break;
    }
  }

  toJSON(): object {
    const sortedParts = [...this.parts].sort((a, b) => {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dz = a.z - b.z;
      if (dy !== 0) {
        return dy;
      }
      if (dx !== 0) {
        return dx;
      }
      return dz;
    });
    return range(-1, 1).map(y => ({
      y,
      parts: sortedParts.filter(p => p.y === y).map(cubePartToString),
    }));
  }
}

export function makeSideFilter(
  side: Direction
): (part: { x: number; y: number; z: number }) => boolean {
  switch (side) {
    case Direction.NegX:
      return part => part.x === -1;
    case Direction.PosX:
      return part => part.x === 1;
    case Direction.NegY:
      return part => part.y === -1;
    case Direction.PosY:
      return part => part.y === 1;
    case Direction.NegZ:
      return part => part.z === -1;
    case Direction.PosZ:
      return part => part.z === 1;
    default:
      throw new Error(`Invalid side: ${side}`);
  }
}
//     |
//  +y |  / -z
//     | /
//     |/     +x
//     0---------
//    /
//   / +z
//  /
/* eslint-disable no-param-reassign */
function rotateAroundX(part: CubePart): CubePart {
  const [y, z] = rotateCoordinates(part.y, part.z);
  part.y = y;
  part.z = z;
  return part;
}

function rotateAroundZ(part: CubePart): CubePart {
  const [x, y] = rotateCoordinates(part.x, part.y);
  part.x = x;
  part.y = y;
  return part;
}

function rotateAroundY(part: CubePart): CubePart {
  const [x, z] = rotateCoordinates(part.x, part.z);
  part.x = x;
  part.z = z;
  return part;
}
/* eslint-enable no-param-reassign */

function rotateCoordinates(x1: number, x2: number): [number, number] {
  if (x1 === 1 && x2 === 1) {
    // back top
    return [1, -1];
  }
  if (x1 === 1 && x2 === 0) {
    // middle top
    // x1 = 0;
    return [0, -1];
  }
  if (x1 === 1 && x2 === -1) {
    // front top
    return [-1, -1];
  }
  if (x1 === 0 && x2 === 1) {
    // middle back
    return [1, 0];
  }
  if (x1 === 0 && x2 === -1) {
    // middle front
    return [-1, 0];
  }
  if (x1 === -1 && x2 === 1) {
    // back bottom
    return [1, 1];
  }
  if (x1 === -1 && x2 === 0) {
    // middle bottom
    return [0, 1];
  }
  if (x1 === -1 && x2 === -1) {
    // front bottom
    return [-1, 1];
  }
  return [x1, x2];
}
