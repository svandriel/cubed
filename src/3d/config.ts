import { ReinhardToneMapping } from 'three';

import { SceneConfigOpts } from '../domain/scene-config';
import bumpMap from '../textures/bumpmaps/metal.jpg';
import cubeMapNegX from '../textures/cubemaps/Yokohama3/negx.jpg';
import cubeMapNegY from '../textures/cubemaps/Yokohama3/negy.jpg';
import cubeMapNegZ from '../textures/cubemaps/Yokohama3/negz.jpg';
import cubeMapPosX from '../textures/cubemaps/Yokohama3/posx.jpg';
import cubeMapPosY from '../textures/cubemaps/Yokohama3/posy.jpg';
import cubeMapPosZ from '../textures/cubemaps/Yokohama3/posz.jpg';

// import skymap from '../textures/hdri/green_sanctuary_4k.hdri';

export const SceneConfig: SceneConfigOpts = {
  autoRotate: false,
  ambientIntensity: 0.7,
  ambientLightColor: 0xffff00,
  pointLightIntensity: 0,
  pointLightColor: 0xffffff,
  environmentMapIntensity: 1,
  bloomEnabled: true,
  bloomThreshold: 0,
  bloomStrength: 0.2,
  bloomRadius: 0,
  adaptiveToneMappingEnabled: true,
  toneMapping: ReinhardToneMapping,
  toneMappingExposure: 0.9 ** 4,
  skymapCubeFiles: [cubeMapPosX, cubeMapNegX, cubeMapPosY, cubeMapNegY, cubeMapPosZ, cubeMapNegZ],
  // skymapHdriFile: skymap,
  cubeSize: 0.99,
  cubeReflectivity: 1,
  cubeRoundRadius: 0.1,
  cubeSegments: 3,
  cubeBumpScale: 0.015,
  cubeBumpMap: bumpMap,
  cubeMetalness: 0.924, // 0.85,
  cubeRoughness: 0.1,
  cubeClearcoat: 1,
  cubeClearcoatRoughness: 0.1,
  turnDuration: 400, // in milliseconds
  autoScrambleInterval: 400,
};
