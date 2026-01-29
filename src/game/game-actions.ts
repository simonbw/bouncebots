import { mod } from "../utility/MathUtil";
import { choose, getGoalSeed, getSeed, seededShuffle } from "../utility/Random";
import { getGoals } from "./game-helpers";
import { Game, Move, Position, RobotId, ROBOT_IDS } from "./game-model";
import { Grid, GRID_1 } from "./grid";

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

export function addMove(game: Game, move: Move): Game {
  const moves = [...game.moves, move];
  return { ...game, moves };
}

export function undoMove(game: Game): Game {
  const moves = [...game.moves];
  moves.pop();
  return { ...game, moves };
}

export function clearMoves(game: Game): Game {
  const moves = [];
  return { ...game, moves };
}

export function chooseGoal(game: Game, goalSeed?: number): Game {
  if (goalSeed !== undefined) {
    const goals = getGoals(game.grid);
    return {
      ...game,
      goal: goals[mod(goalSeed, goals.length)],
    };
  } else {
    const otherGoals = getGoals(game.grid).filter(
      // remove the current goal so we don't get it twice in a row
      ({ x, y, robot }) =>
        !(x === game.goal?.x && y === game.goal.y && robot === game.goal.robot)
    );

    if (otherGoals.length === 0) {
      return game;
    } else {
      return {
        ...game,
        goal: choose(...otherGoals),
      };
    }
  }
}
