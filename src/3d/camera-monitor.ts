import { Camera, Event, EventDispatcher, Vector3 } from 'three';

import { Direction } from '../domain/direction';
import { minBy } from '../fn/min-by';

interface CameraDirectionChanged {
  left: Direction;
  right: Direction;
}

interface CameraMonitor {
  update(): void;
  onChange(callback: (e: CameraDirectionChanged) => void): void;
  dispose(): void;
}

interface AngleChangedEvent extends Event {
  left: Direction;
  right: Direction;
}

interface Angle {
  vector: Vector3;
  left: Direction;
  right: Direction;
}
const angles: Angle[] = [
  { vector: new Vector3(1, 0, 1), left: Direction.PosZ, right: Direction.PosX },
  { vector: new Vector3(1, 0, -1), left: Direction.PosX, right: Direction.NegZ },
  { vector: new Vector3(-1, 0, -1), left: Direction.NegZ, right: Direction.NegX },
  { vector: new Vector3(-1, 0, 1), left: Direction.NegX, right: Direction.PosZ },
];

export function createCameraMonitor(camera: Camera): CameraMonitor {
  const events = new EventDispatcher<AngleChangedEvent>();
  let lastCameraPosition: Vector3 | undefined;
  let lastCameraAngle: Angle | undefined;
  const listeners: ((event: AngleChangedEvent) => void)[] = [];

  return {
    update() {
      if (lastCameraPosition && camera.position.distanceTo(lastCameraPosition) > 0.001) {
        const flatCameraPosition = camera.position.clone().setY(0);

        const angle = minBy(a => a.vector.angleTo(flatCameraPosition), angles);

        if (angle !== lastCameraAngle && typeof angle !== 'undefined') {
          events.dispatchEvent({
            type: 'changed',
            target: camera,
            left: angle.left,
            right: angle.right,
          });
        }
        lastCameraAngle = angle;
      }
      lastCameraPosition = camera.position.clone();
    },
    onChange(callback) {
      const listener = (cb: AngleChangedEvent): void => {
        callback({
          left: cb.left,
          right: cb.right,
        });
      };
      listeners.push(listener);
      events.addEventListener('changed', listener);
    },
    dispose() {
      listeners.forEach(listener => {
        events.removeEventListener('changed', listener);
      });
      listeners.splice(0, listeners.length);
    },
  };
}
