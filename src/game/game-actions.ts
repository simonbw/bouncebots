import { mod } from "../utility/MathUtil";
import { choose } from "../utility/Random";
import { getGoals } from "./game-helpers";
import { Game, Move } from "./game-model";

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
