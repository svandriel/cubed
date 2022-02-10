import {
  Mesh,
  NoToneMapping,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Raycaster,
  sRGBEncoding,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { AdaptiveToneMappingPass } from 'three/examples/jsm/postprocessing/AdaptiveToneMappingPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import { CubePart, cubePartToString } from '../domain/cube-part';
import { Direction } from '../domain/direction';
import { createCameraMonitor } from './camera-monitor';
import { SceneConfig } from './config';
import { createGui } from './gui';
import { CubeScene } from './scene';

export interface RenderContext {
  renderElement: HTMLCanvasElement;
  guiElement: HTMLElement;
  camera: THREE.PerspectiveCamera;
  onResize(newWidth: number, newHeight: number): void;
  render(): void;
  destroy(): void;
  onClick(location: Vector2): void;
  get autoRotate(): boolean;
  set autoRotate(val: boolean);
  get leftFacingAxis(): Direction;
  get rightFacingAxis(): Direction;
}

export default function createRenderer(
  width: number,
  height: number,
  cubeScene: CubeScene
): RenderContext {
  console.log(`Creating renderer at ${width} x ${height}`);
  const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(2.5, 2.5, 3.1);
  camera.up.set(0, 1, 0);
  camera.lookAt(0, 0, 0);
  let leftFacingAxis = Direction.PosZ;
  let rightFacingAxis = Direction.PosX;

  const rayCaster = new Raycaster();

  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.toneMapping = SceneConfig.toneMapping || NoToneMapping;
  renderer.toneMappingExposure = SceneConfig.toneMappingExposure ?? 1;
  renderer.outputEncoding = sRGBEncoding;

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(cubeScene.scene, camera);
  composer.addPass(renderPass);

  const tonemapping = new AdaptiveToneMappingPass(true, 1024);
  tonemapping.setAdaptionRate(1); // default 1
  tonemapping.setMinLuminance(0.01); // default 0.01
  tonemapping.setMiddleGrey(1);
  tonemapping.setMaxLuminance(2);
  tonemapping.enabled = SceneConfig.adaptiveToneMappingEnabled;
  composer.addPass(tonemapping);

  const bloomPass = new UnrealBloomPass(
    new Vector2(width, height),
    SceneConfig.bloomStrength,
    SceneConfig.bloomRadius,
    SceneConfig.bloomThreshold
  );
  bloomPass.enabled = SceneConfig.bloomEnabled;
  composer.addPass(bloomPass);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.minDistance = 2;
  controls.maxDistance = camera.position.length() * 2;
  controls.enablePan = false;

  const gui = createGui(cubeScene, controls, camera, renderer, bloomPass, tonemapping);

  let lastRenderTime = 0;
  let currentWidth = width;
  let currentHeight = height;

  const cameraMonitor = createCameraMonitor(camera);
  cameraMonitor.onChange(angle => {
    console.log(`Camera now facing`, angle.left, angle.right);
    leftFacingAxis = angle.left;
    rightFacingAxis = angle.right;
  });

  function render(): void {
    const now = getTimestamp();

    const dt = lastRenderTime === 0 ? 0 : now - lastRenderTime;
    lastRenderTime = now;
    if (dt > 0) {
      cubeScene.animate(dt);
    }
    cameraMonitor.update();
    controls.update();
    composer.render(dt);
  }

  return {
    renderElement: renderer.domElement,
    guiElement: gui.domElement,
    camera,
    onResize(newWidth: number, newHeight: number) {
      if (newWidth === 0 || newHeight === 0) {
        return;
      }
      console.log(`Resizing to ${newWidth}x${newHeight}`);
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      composer.setSize(newWidth, newHeight);
      currentWidth = newWidth;
      currentHeight = newHeight;
    },
    render,
    destroy() {
      renderer.dispose();
      console.log('Destroyed renderer');
    },
    onClick(location) {
      const loc = new Vector2(
        (location.x / currentWidth) * 2 - 1,
        -(location.y / currentHeight) * 2 + 1
      );
      rayCaster.setFromCamera(loc, camera); // calculate objects intersecting the picking ray

      const meshes = cubeScene.getMeshes();
      const intersects = rayCaster.intersectObjects(meshes);
      if (intersects.length > 0) {
        const firstIntersection = intersects[0];

        const normal = firstIntersection.face?.normal as Vector3;
        const mesh = firstIntersection.object as Mesh;
        const part = mesh.userData.part as CubePart;
        const axis = getDirection(normal);
        console.log(`Clicked on: ${cubePartToString(part)}, normal: `, normal, axis);
      }
    },
    get autoRotate() {
      return controls.autoRotate;
    },
    set autoRotate(val: boolean) {
      controls.autoRotate = val;
    },
    get leftFacingAxis() {
      return leftFacingAxis;
    },
    get rightFacingAxis() {
      return rightFacingAxis;
    },
  };
}

function getTimestamp(): number {
  return typeof performance === 'undefined' ? Date.now() : performance.now();
}

const axes: Record<string, Vector3> = {
  posX: new Vector3(1, 0, 0),
  posY: new Vector3(0, 1, 0),
  posZ: new Vector3(0, 0, 1),
  negX: new Vector3(-1, 0, 0),
  negY: new Vector3(0, -1, 0),
  negZ: new Vector3(0, 0, -1),
};

function getDirection(normal: Vector3): string {
  const results = Object.entries(axes).map(([name, axis]) => {
    return {
      name,
      angle: normal.angleTo(axis),
    };
  });
  const result = results.reduce(
    (acc, item) => {
      if (item.angle < acc.minAngle) {
        return {
          minAngle: item.angle,
          axisValue: item.name,
        };
      }
      return acc;
    },
    {
      minAngle: Number.MAX_VALUE,
      axisValue: '',
    }
  );
  return result.axisValue;
}
