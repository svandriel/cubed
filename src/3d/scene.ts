import * as ease from 'd3-ease';
import {
  AmbientLight,
  AxesHelper,
  Color,
  CubeTextureLoader,
  Event,
  Light,
  Material,
  Mesh,
  Object3D,
  PointLight,
  Scene,
  Texture,
  TextureLoader,
  Vector3,
} from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

import { Axis } from '../domain/axis';
import { Cube, makeSideFilter as makeSidePredicate } from '../domain/cube';
import { CubePart } from '../domain/cube-part';
import { CubeColor } from '../domain/cube-part-color';
import { Direction } from '../domain/direction';
import { isCubeRotateMove, isCubeTurnMove, Move, toAxisVector } from '../domain/move';
import {
  isCubeRotateAnimation,
  isCubeTurnAnimation,
  TurnAnimation,
} from '../domain/turn-animation';
import { compact } from '../fn/compact';
import { SceneConfig } from './config';
import { makeCubeMaterials } from './cube-materials';
import { createCubeMesh } from './cube-mesh';
import { loadCubeMapTexture, loadHdriEnvTexture } from './loading';

const rotationPerTurn = 0.5 * Math.PI;

const easingFunction: (t: number) => number = ease.easeCubicOut;

const rotationVectors: Record<Direction, Vector3> = {
  [Direction.NegX]: new Vector3(1, 0, 0),
  [Direction.PosX]: new Vector3(-1, 0, 0),
  [Direction.PosY]: new Vector3(0, -1, 0),
  [Direction.NegY]: new Vector3(0, 1, 0),
  [Direction.PosZ]: new Vector3(0, 0, -1),
  [Direction.NegZ]: new Vector3(0, 0, 1),
};

export class CubeScene {
  public readonly scene: Scene;

  private readonly cubeGroup: Object3D<Event>;

  private readonly root: Object3D;

  private readonly lights: Light[];

  private readonly textures: Texture[];

  private readonly materials: Material[];

  private readonly cubePartNodes: Object3D[];

  private turnAnimationQueue: TurnAnimation[] = [];

  private turnAnimation: TurnAnimation | undefined;

  private readonly axesHelper: AxesHelper;

  public turnDuration: number = SceneConfig.turnDuration;

  public autoScrambleDuration: number = SceneConfig.autoScrambleInterval;

  public readonly cube = new Cube();

  constructor() {
    this.scene = new Scene();

    // Root scene object
    this.root = new Object3D(); // <div>
    this.scene.add(this.root);

    // Cube group is directly under the root
    this.cubeGroup = new Object3D();
    this.root.add(this.cubeGroup);

    const rgbeLoader = new RGBELoader();
    const cubeTextureLoader = new CubeTextureLoader();
    const textureLoader = new TextureLoader();

    const { materials, textures } = makeCubeMaterials(textureLoader);

    const cubemap = loadCubeMapTexture(cubeTextureLoader, this.scene, Object.values(materials));
    const hdriEnvTexture = loadHdriEnvTexture(rgbeLoader, this.scene, Object.values(materials));

    this.cubePartNodes = createCubePartNodes(this.cube, materials);
    this.cubeGroup.add(...this.cubePartNodes);

    this.textures = compact([cubemap, hdriEnvTexture, ...textures]);
    this.materials = Object.values(materials);
    this.lights = compact([createAmbientLight(), createPointLight()]);
    this.scene.add(...this.lights);

    this.axesHelper = new AxesHelper(20);
    this.axesHelper.setColors(new Color(0xffffff), new Color(0xff0000), new Color(0x00ff00));
  }

  queueMove(move: Move): void {
    if (isCubeTurnMove(move)) {
      this.turnAnimationQueue.push({
        ...move,
        progress: 0,
        easedProgress: 0,
        nodes: [],
        axis: rotationVectors[move.side],
        duration: this.turnDuration,
      });
    } else if (isCubeRotateMove(move)) {
      this.turnAnimationQueue.push({
        ...move,
        progress: 0,
        easedProgress: 0,
        nodes: [],
        axis: toAxisVector(move.axisName),
        duration: this.turnDuration,
      });
    }
  }

  destroy(): void {
    this.lights.forEach(light => {
      light.dispose();
      this.scene.remove(light);
    });
    this.textures.forEach(texture => texture.dispose());
    this.materials.forEach(material => material.dispose());
    this.scene.traverse(obj => {
      if (obj instanceof Mesh) {
        obj.geometry.dispose();
        this.scene.remove(obj);
      }
    });
    if (this.autoScrambleInterval) {
      clearInterval(this.autoScrambleInterval);
    }
  }

  animate(dt: number): void {
    if (!this.turnAnimation && this.turnAnimationQueue.length > 0) {
      const turnAnimation = this.turnAnimationQueue.shift() as TurnAnimation;

      this.setActiveTurnAnimation(turnAnimation);
    }
    if (!this.turnAnimation) {
      return;
    }

    const anim = this.turnAnimation;
    if (anim.progress >= 1) {
      this.turnAnimation = undefined;
      return;
    }
    const currentProgress = anim.progress;
    const progressIncrement = dt / anim.duration;
    const newProgress = Math.min(1, currentProgress + progressIncrement);
    anim.progress = newProgress;

    const easedProgress = easingFunction(newProgress);
    const easeProgressDelta = easedProgress - anim.easedProgress;
    anim.easedProgress = easedProgress;

    const rotation = easeProgressDelta * rotationPerTurn;
    anim.nodes.forEach(node => {
      node.rotateOnWorldAxis(anim.axis, anim.clockwise ? rotation : -rotation);
    });
  }

  private setActiveTurnAnimation(turnAnimation: TurnAnimation): void {
    // Speed up turn duration if there is more queued
    // - 0 queued -> this.turnDuration
    // - 1 queued -> 0.5 * this.turnDuration
    // - 2 queued -> 0.25 * this.turnDuration
    // - etc...
    const duration = this.turnDuration * 2 ** -this.turnAnimationQueue.length;

    let nodes: Object3D<Event>[];

    if (isCubeTurnAnimation(turnAnimation)) {
      const hasSide = makeSidePredicate(turnAnimation.side);
      nodes = this.cubePartNodes.filter(node => hasSide(node.userData.part as CubePart));
      this.cube.turn(turnAnimation);
    } else if (isCubeRotateAnimation(turnAnimation)) {
      nodes = this.cubePartNodes;
      this.cube.rotate(turnAnimation);
    } else {
      throw new Error(`Unsupported turnanimation: ${JSON.stringify(turnAnimation)}`);
    }
    this.turnAnimation = {
      ...turnAnimation,
      duration,
      nodes,
    };
  }

  getMeshes(): Mesh[] {
    const meshes: Mesh[] = [];
    this.scene.traverse(obj => {
      if (obj instanceof Mesh) {
        meshes.push(obj);
      }
    });
    return meshes;
  }

  get enableAxesHelper(): boolean {
    return this.axesHelper.parent !== null;
  }

  set enableAxesHelper(value: boolean) {
    if (value) {
      this.scene.add(this.axesHelper);
    } else {
      this.scene.remove(this.axesHelper);
    }
  }

  private autoScrambleInterval: NodeJS.Timer | null = null;

  get enableAutoScrambler(): boolean {
    return !!this.autoScrambleInterval;
  }

  set enableAutoScrambler(value: boolean) {
    if (value) {
      if (this.autoScrambleInterval) {
        return;
      }

      this.autoScrambleInterval = setInterval(() => {
        this.enqueueRandomMove();
      }, this.autoScrambleDuration);
    }
    if (!value) {
      if (!this.autoScrambleInterval) {
        return;
      }
      clearInterval(this.autoScrambleInterval);
      this.autoScrambleInterval = null;
    }
  }

  private enqueueRandomMove(): void {
    const sides = Object.values(Direction);
    const axes = Object.values(Axis);
    const randomSide = sides[Math.floor(Math.random() * sides.length)];
    const randomAxis = axes[Math.floor(Math.random() * axes.length)];
    const isRotateMove = Math.random() < 0.1;
    const clockwise = Math.random() > 0.5;
    const move: Move = isRotateMove
      ? {
          axisName: randomAxis,
          clockwise,
        }
      : {
          side: randomSide,
          clockwise,
        };
    this.queueMove(move);
  }
}

function createAmbientLight(): Light {
  return new AmbientLight(SceneConfig.ambientLightColor, SceneConfig.ambientIntensity);
}

function createPointLight(): Light | null {
  if (SceneConfig.pointLightIntensity === 0) {
    return null;
  }
  const light = new PointLight(SceneConfig.pointLightColor, SceneConfig.pointLightIntensity);
  light.castShadow = true;
  light.position.set(10, 10, 10);
  return light;
}

function createCubePartNodes(cube: Cube, materials: Record<CubeColor, Material>): Object3D[] {
  const nodes = cube.parts.map(part => {
    if (part.x === 0 && part.y === 0 && part.z === 0) {
      return null;
    }
    const cubeMesh = createCubeMesh({
      materials: part.colors.map(color => materials[color]),
      size: SceneConfig.cubeSize,
      radius: SceneConfig.cubeRoundRadius,
      segments: SceneConfig.cubeSegments,
    });
    cubeMesh.position.set(part.x, part.y, part.z);
    cubeMesh.userData = {
      part,
    };

    const cubePartNode = new Object3D();
    cubePartNode.add(cubeMesh);
    cubePartNode.userData = {
      part,
    };
    return cubePartNode;
  });
  return compact(nodes);
}
