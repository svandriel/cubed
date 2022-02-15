import {
  CubeTextureLoader,
  EquirectangularReflectionMapping,
  Material,
  MeshPhysicalMaterial,
  Scene,
  Texture,
} from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

import { SceneConfig } from './config';

export function loadCubeMapTexture(
  cubeTextureLoader: CubeTextureLoader,
  scene: Scene,
  materials: Material[]
): Texture | null {
  const files = SceneConfig.skymapCubeFiles;
  return files
    ? cubeTextureLoader.load(files, tex => {
        // eslint-disable-next-line no-param-reassign
        scene.background = tex;
        applyEnvironmentToMaterials(materials, tex);
      })
    : null;
}

export function loadHdriEnvTexture(
  rgbeLoader: RGBELoader,
  scene: Scene,
  materials: Material[]
): Texture | null {
  return SceneConfig.skymapHdriFile
    ? rgbeLoader.load(SceneConfig.skymapHdriFile, tex => {
        // eslint-disable-next-line no-param-reassign
        tex.mapping = EquirectangularReflectionMapping;
        // eslint-disable-next-line no-param-reassign
        scene.background = tex;
        applyEnvironmentToMaterials(materials, tex);
      })
    : null;
}

function applyEnvironmentToMaterials(materials: Material[], hdriEnvTexture: Texture | null): void {
  materials.forEach(material => {
    if (material instanceof MeshPhysicalMaterial) {
      // eslint-disable-next-line no-param-reassign
      material.envMap = hdriEnvTexture;
    }
  });
}
