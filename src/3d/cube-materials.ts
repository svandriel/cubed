import {
  LinearMipMapLinearFilter,
  Material,
  MeshPhysicalMaterial,
  MirroredRepeatWrapping,
  RepeatWrapping,
  Texture,
  TextureLoader,
} from 'three';

import { CubeColor, cubeColors } from '../domain/cube-part-color';
import { compact } from '../fn/compact';
import { SceneConfig } from './config';

export function makeCubeMaterials(textureLoader: TextureLoader): {
  materials: Record<CubeColor, Material>;
  textures: Texture[];
} {
  const bumpMap = createBumpMap(textureLoader);
  const normalmap = createNormalMap(textureLoader);
  const displacementMap = createDisplacementMap(textureLoader);
  const specularMap = createSpecularMap(textureLoader);
  const colorMap = createColorMap(textureLoader);
  const materials = Object.values(CubeColor).reduce((acc, color) => {
    acc[color] = createMaterial(color, colorMap, bumpMap, displacementMap, normalmap, specularMap);
    return acc;
  }, {} as Record<CubeColor, Material>);
  return { materials, textures: compact([bumpMap, normalmap, specularMap, displacementMap]) };
}

function createColorMap(textureLoader: TextureLoader): Texture | null {
  return SceneConfig.cubeColorMap ? textureLoader.load(SceneConfig.cubeColorMap) : null;
}

function createSpecularMap(textureLoader: TextureLoader): Texture | null {
  return SceneConfig.cubeSpecularMap ? textureLoader.load(SceneConfig.cubeSpecularMap) : null;
}

function createDisplacementMap(textureLoader: TextureLoader): Texture | null {
  const displacementMap =
    SceneConfig.cubeDisplacementMap && SceneConfig.cubeDisplacementScale
      ? textureLoader.load(SceneConfig.cubeDisplacementMap)
      : null;
  if (displacementMap) {
    displacementMap.wrapS = MirroredRepeatWrapping;
    displacementMap.wrapT = RepeatWrapping;
  }
  return displacementMap;
}

function createNormalMap(textureLoader: TextureLoader): Texture | null {
  return SceneConfig.cubeNormalMap ? textureLoader.load(SceneConfig.cubeNormalMap) : null;
}

function createBumpMap(textureLoader: TextureLoader): Texture | null {
  const bumpMap =
    SceneConfig.cubeBumpScale && SceneConfig.cubeBumpMap
      ? textureLoader.load(SceneConfig.cubeBumpMap)
      : null;
  if (bumpMap) {
    bumpMap.minFilter = LinearMipMapLinearFilter;
  }
  return bumpMap;
}

function createMaterial(
  color: CubeColor,
  colorMap: Texture | null,
  bumpMap: Texture | null,
  displacementMap: Texture | null,
  normalmap: Texture | null,
  specularMap: Texture | null
): MeshPhysicalMaterial {
  return new MeshPhysicalMaterial({
    color: cubeColors[color],
    map: colorMap,
    envMapIntensity: SceneConfig.environmentMapIntensity,
    bumpMap,
    bumpScale: SceneConfig.cubeBumpScale ?? 0.01,
    displacementMap,
    displacementScale: SceneConfig.cubeDisplacementScale ?? 0.1,
    normalMap: normalmap,
    reflectivity: SceneConfig.cubeReflectivity,
    metalness: SceneConfig.cubeMetalness,
    roughness: SceneConfig.cubeRoughness,
    clearcoat: SceneConfig.cubeClearcoat,
    clearcoatMap: specularMap,
    clearcoatRoughness: SceneConfig.cubeClearcoatRoughness,
  });
}
