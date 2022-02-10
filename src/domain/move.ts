import { Vector3 } from 'three';

import { Axis } from './axis';
import { Direction } from './direction';

export type Move = CubeTurnMove | CubeRotateMove;

export interface CubeTurnMove {
  side: Direction;
  clockwise: boolean;
}

export function isCubeTurnMove(move: Move): move is CubeTurnMove {
  return 'side' in move;
}

export interface CubeRotateMove {
  axisName: Axis;
  clockwise: boolean;
}

export function isCubeRotateMove(move: Move): move is CubeRotateMove {
  return 'axisName' in move;
}

export function toAxisVector(axis: Axis): Vector3 {
  switch (axis) {
    case Axis.X:
      return new Vector3(1, 0, 0);
    case Axis.Y:
      return new Vector3(0, 1, 0);
    case Axis.Z:
      return new Vector3(0, 0, 1);
    default:
      throw new Error(`Invalid axis: ${axis}`);
  }
}
