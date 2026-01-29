import { Grid, GRID_1 } from "./grid";

export const DIRECTIONS = ["up", "right", "down", "left"] as const;
export const ROBOT_IDS = ["red", "blue", "green", "yellow"] as const;

export type Direction = (typeof DIRECTIONS)[number];
export type RobotId = (typeof ROBOT_IDS)[number];

export interface Move {
  readonly robot: RobotId;
  readonly direction: Direction;
}

export type Position = [number, number];

interface Goal {
  robot: RobotId;
  x: number;
  y: number;
}

export interface Game {
  readonly grid: Grid;
  readonly startPositions: Record<RobotId, Position>;
  readonly moves: Move[];
  readonly goal?: Goal;
  readonly seed: number;
}
