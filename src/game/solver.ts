import { addMove } from "./game-actions";
import { canAddMove, isGameSolved } from "./game-helpers";
import { DIRECTIONS, Game, ROBOT_IDS } from "./game-model";

// Syncronous solver
export function solveGame(game: Game, moveLimit = 4): Game | undefined {
  const options: Game[] = [game];

  let iterations = 0;
  while (options.length > 0) {
    iterations++;
    const option = options.shift()!;
    if (isGameSolved(option)) {
      console.log("solved in " + option.moves.length + " moves");
      return option;
    }

    if (option.moves.length < moveLimit) {
      for (const direction of DIRECTIONS) {
        for (const robot of ROBOT_IDS) {
          const move = { robot, direction };
          if (canAddMove(option, move)) {
            options.push(addMove(option, move));
          }
        }
      }
    }

    if (iterations % 1000 == 0) {
      console.log("solving...", iterations);
    }
  }

  return undefined;
}

// Asynchronus solver
export class Solver {
  options: Game[];
  solution?: Game;
  iterations = 0;
  started = performance.now();
  ended: number = 0;

  constructor(private game: Game) {
    this.options = [game];
  }

  onSolve(solution: Game) {
    this.solution = solution;
    this.ended = performance.now();
    console.log(
      `solved ${this.iterations} i, ${
        this.solution.moves.length - this.game.moves.length
      }m ${((this.ended - this.started) / 1000).toPrecision(2)}s)`
    );
  }

  doIteration() {
    if (this.solution) {
      return;
    }
    const option = this.options.shift()!;
    if (isGameSolved(option)) {
      this.onSolve(option);
      return;
    }

    this.iterations++;

    for (const direction of DIRECTIONS) {
      for (const robot of ROBOT_IDS) {
        const move = { robot, direction };
        if (canAddMove(option, move)) {
          this.options.push(addMove(option, move));
        }
      }
    }
  }
}
