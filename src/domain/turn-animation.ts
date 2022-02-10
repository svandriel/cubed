import { Event, Object3D, Vector3 } from 'three';

import { Axis } from './axis';
import { Direction } from './direction';

export interface TurnAnimation {
  clockwise: boolean;
  progress: number;
  easedProgress: number;
  axis: Vector3;
  duration: number;
  nodes: Object3D<Event>[];
}

export interface CubeTurnAnimation extends TurnAnimation {
  side: Direction;
}

export function isCubeTurnAnimation(anim: TurnAnimation): anim is CubeTurnAnimation {
  return 'side' in anim;
}

export interface CubeRotateAnimation extends TurnAnimation {
  axisName: Axis;
}

export function isCubeRotateAnimation(anim: TurnAnimation): anim is CubeRotateAnimation {
  return 'axisName' in anim;
}
