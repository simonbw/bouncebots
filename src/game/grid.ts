import { RobotId } from "./game-model";
import { GRID_1_TEXT } from "./grid1";

export type Cell = EmptyCell | BlockedCell | GoalCell;
export type Wall = { horizontal: boolean; vertical: boolean };
export type Grid = { walls: Wall[][]; cells: Cell[][] };

export interface EmptyCell {
  readonly type: "EMPTY";
}

export interface BlockedCell {
  readonly type: "BLOCKED";
}

export interface GoalCell {
  readonly type: "GOAL";
  readonly robotId: RobotId;
  readonly number: number;
}

export function makeEmptyGrid(width = 16, height = 16): Grid {
  const cells: Cell[][] = [];
  const walls: Wall[][] = [];

  for (let x = 0; x < width; x++) {
    const row: Cell[] = [];
    for (let y = 0; y < height; y++) {
      if ((x == 7 || x == 8) && (y == 7 || y == 8)) {
        row.push({
          type: "BLOCKED",
        });
      } else {
        row.push({
          type: "EMPTY",
        });
      }
    }
    cells.push(row);
  }

  for (let x = 0; x <= width; x++) {
    walls.push([]);
    for (let y = 0; y <= height; y++) {
      const horizontal = (y == 0 || y == height) && x < width;
      const vertical = (x == 0 || x == width) && y < height;
      walls[x].push({ horizontal, vertical });
    }
  }

  return { cells, walls };
}

export function textToGrid(gridString: string): Grid {
  // TODO: Infer size
  const grid = makeEmptyGrid(16, 16);

  const lines = gridString.trim().split("\n");

  const goalCounts: Record<RobotId, number> = {
    red: 0,
    green: 0,
    blue: 0,
    yellow: 0,
  };

  for (const [lineNumber, line] of lines.entries()) {
    for (const [charIndex, char] of line.split("").entries()) {
      const x = Math.floor(charIndex / 2);
      const y = Math.floor(lineNumber / 2);

      if (lineNumber % 2 == 0) {
        // wall rows
        if (charIndex % 2 == 0) {
          // unused
        } else {
          // walls
          if (char == "-") {
            grid.walls[x][y].horizontal = true;
          }
        }
      } else {
        // space rows
        if (charIndex % 2 == 0) {
          // walls
          if (char == "|") {
            grid.walls[x][y].vertical = true;
          }
        } else {
          // spaces
          switch (char) {
            case "X": {
              grid.cells[x][y] = { type: "BLOCKED" };
              break;
            }
            case "r": {
              grid.cells[x][y] = {
                type: "GOAL",
                robotId: "red",
                number: goalCounts["red"]++,
              };
              break;
            }
            case "g": {
              grid.cells[x][y] = {
                type: "GOAL",
                robotId: "green",
                number: goalCounts["green"]++,
              };
              break;
            }
            case "b": {
              grid.cells[x][y] = {
                type: "GOAL",
                robotId: "blue",
                number: goalCounts["blue"]++,
              };
              break;
            }
            case "y": {
              grid.cells[x][y] = {
                type: "GOAL",
                robotId: "yellow",
                number: goalCounts["yellow"]++,
              };
              break;
            }
          }
        }
      }
    }
  }

  return grid;
}

export const GRID_1: Grid = textToGrid(GRID_1_TEXT);
