import { Material, Mesh } from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';

import { memo } from '../fn/memo';

export interface CubeMeshOptions {
  size: number;
  materials: Material[];
  segments: number;
  radius: number;
}

const defaultCubeMeshOptions: CubeMeshOptions = {
  size: 0.96,
  materials: [],
  segments: 3,
  radius: 0.05,
};

const createRoundedBoxCached = memo(createRoundedBox);

export function createCubeMesh(options: Partial<CubeMeshOptions> = {}): Mesh {
  const opts = { ...defaultCubeMeshOptions, ...options };
  const { size, segments, radius, materials } = opts;
  const geometry = createRoundedBoxCached({ size, segments, radius });
  const mesh = new Mesh(geometry, materials);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function createRoundedBox({
  size,
  segments,
  radius,
}: {
  size: number;
  segments: number;
  radius: number;
}): RoundedBoxGeometry {
  console.log('createRoundedBox', size, segments, radius);
  return new RoundedBoxGeometry(size, size, size, segments, radius);
}
