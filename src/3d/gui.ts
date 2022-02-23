import { GUI } from 'lil-gui';
import {
  ACESFilmicToneMapping,
  CineonToneMapping,
  LinearToneMapping,
  MeshPhysicalMaterial,
  NoToneMapping,
  ReinhardToneMapping,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { AdaptiveToneMappingPass } from 'three/examples/jsm/postprocessing/AdaptiveToneMappingPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import { CubeScene } from './scene';

type MaterialChanger = (mat: MeshPhysicalMaterial, val: number) => unknown;

export function createGui(
  scene: CubeScene,
  controls: OrbitControls,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  bloomPass: UnrealBloomPass,
  toneMapping: AdaptiveToneMappingPass
): GUI {
  const gui = new GUI();
  gui.close();
  gui.domElement.style.position = 'absolute';
  const materialFolder = gui.addFolder('Material');

  const addMaterialSlider = <
    T extends keyof MeshPhysicalMaterial,
    K extends MeshPhysicalMaterial[T]
  >(
    prop: K,
    min: number,
    max: number
  ): void => {
    materialFolder
      .add(scene.materials[0] as MeshPhysicalMaterial, prop, min, max)
      .onChange((val: number) => {
        scene.materials.forEach(mat => {
          // eslint-disable-next-line no-param-reassign
          mat[prop] = val;
        });
      });
  };
  addMaterialSlider('bumpScale', 0, 0.05);
  addMaterialSlider('clearcoat', 0, 1);
  addMaterialSlider('clearcoatRoughness', 0, 1);
  addMaterialSlider('metalness', 0, 1);
  addMaterialSlider('roughness', 0, 1);
  addMaterialSlider('envMapIntensity', 0, 1);
  addMaterialSlider('transmission', 0, 1);
  addMaterialSlider('thickness', 0, 1);
  addMaterialSlider('reflectivity', 0, 1);

  const mainFolder = gui.addFolder('Main');
  mainFolder.add(controls, 'autoRotate').name('Auto rotate').listen();
  mainFolder.add(scene, 'enableAutoScrambler').name('Auto scramble');
  mainFolder
    .add(scene, 'turnDuration', 100, 2000, 100)
    .name('Turn duration')
    .onChange((val: number) => {
      // eslint-disable-next-line no-param-reassign
      scene.autoScrambleDuration = val;
    });

  const viewFolder = gui.addFolder('View').close();
  viewFolder.add(scene, 'enableAxesHelper').name('Show axes');
  viewFolder
    .add(camera, 'fov', 10, 140, 0.5)
    .name('FOV')
    .onChange(() => {
      camera.updateProjectionMatrix();
    });

  const postprocessGui = gui.addFolder('Postprocessing').close();
  postprocessGui.add(toneMapping, 'enabled').name('Adaptive tonemapping');
  postprocessGui
    .add(renderer, 'toneMapping', {
      None: NoToneMapping,
      Linear: LinearToneMapping,
      Reinhard: ReinhardToneMapping,
      Cineon: CineonToneMapping,
      'ACES Filmic': ACESFilmicToneMapping,
    })
    .name('Tonemapping');
  postprocessGui.add(renderer, 'toneMappingExposure', 0, 4, 0.025).name('Exposure');
  postprocessGui.add(bloomPass, 'enabled').name('Bloom');
  postprocessGui.add(bloomPass, 'strength', 0, 1, 0.05).name('Bloom strength');
  postprocessGui.add(bloomPass, 'radius', 0, 3, 0.05).name('Bloom radius');
  postprocessGui.add(bloomPass, 'threshold', 0, 1, 0.05).name('Bloom threshold');
  return gui;
}
