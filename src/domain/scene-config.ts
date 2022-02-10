import { ToneMapping } from 'three';

export interface SceneConfigOpts {
  autoRotate: boolean;
  ambientIntensity: number;
  ambientLightColor: number;
  pointLightIntensity: number;
  pointLightColor: number;
  environmentMapIntensity: number;
  bloomEnabled: boolean;
  bloomThreshold: number;
  bloomStrength: number;
  bloomRadius: number;
  skymapCubeFiles?: string[];
  skymapHdriFile?: string;
  cubeSize: number;
  cubeReflectivity: number;
  cubeRoundRadius: number;
  cubeSegments: number;
  cubeColorMap?: string;
  cubeBumpMap?: string;
  cubeBumpScale?: number;
  cubeDisplacementMap?: string;
  cubeDisplacementScale?: number;
  cubeNormalMap?: string;
  cubeSpecularMap?: string;
  adaptiveToneMappingEnabled: boolean;
  toneMapping?: ToneMapping;
  toneMappingExposure?: number;
  cubeMetalness: number;
  cubeRoughness: number;
  cubeClearcoat: number;
  cubeClearcoatRoughness: number;
  turnDuration: number;
  autoScrambleInterval: number;
}
