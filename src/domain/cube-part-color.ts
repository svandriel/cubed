import { Direction } from './direction';

export enum CubeColor {
  White = 'WHITE',
  Red = 'RED',
  Orange = 'ORANGE',
  Green = 'GREEN',
  Blue = 'BLUE',
  Yellow = 'YELLOW',
  Inside = 'INSIDE',
}

const green = 0x00c000;
const blue = 0x0000c0;
const white = 0xc0c0c0;
const yellow = 0xc0c000;
const red = 0xc00000;
const orange = 0xff4000;
const black = 0x000000;

export const cubeColorsBySide: Record<Direction, CubeColor> = {
  [Direction.PosY]: CubeColor.White,
  [Direction.NegY]: CubeColor.Yellow,
  [Direction.PosZ]: CubeColor.Green,
  [Direction.PosX]: CubeColor.Red,
  [Direction.NegZ]: CubeColor.Blue,
  [Direction.NegX]: CubeColor.Orange,
};

export const cubeColors: Record<CubeColor, number> = {
  [CubeColor.White]: white,
  [CubeColor.Yellow]: yellow,
  [CubeColor.Green]: green,
  [CubeColor.Red]: red,
  [CubeColor.Blue]: blue,
  [CubeColor.Orange]: orange,
  [CubeColor.Inside]: black,
};
