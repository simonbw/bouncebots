import { getGoalSeed, getSeed, seededShuffle } from "../utility/Random";
import { chooseGoal } from "./game-actions";
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

export function makeGame(seed = getSeed(), goalSeed = getGoalSeed()): Game {
  const grid = GRID_1;
  const game = {
    grid,
    startPositions: chooseStartPositions(grid, seed),
    moves: [],
    seed,
  };

  return chooseGoal(game, goalSeed);
}

function chooseStartPositions(
  grid: Grid,
  seed = getSeed()
): Record<RobotId, Position> {
  const available: Position[] = [];
  for (let x = 0; x < grid.cells.length; x++) {
    for (let y = 0; y < grid.cells[x].length; y++) {
      if (grid.cells[x][y].type === "EMPTY") {
        available.push([x, y]);
      }
    }
  }

  seededShuffle(available, seed);

  return {
    red: available.pop()!,
    blue: available.pop()!,
    green: available.pop()!,
    yellow: available.pop()!,
  };
}
