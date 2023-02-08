import { memoize } from "../utility/memoize";
import { Direction, Game, Move, Position, RobotId } from "./game-model";
import { GoalCell, Grid } from "./grid";

export function getGoals(
  grid: Grid
): { x: number; y: number; robot: RobotId }[] {
  return grid.cells
    .map((column, x) => column.flatMap((cell, y) => ({ x, y, cell })))
    .flat()
    .filter(
      (data): data is { x: number; y: number; cell: GoalCell } =>
        data.cell.type === "GOAL"
    )
    .map(({ x, y, cell }) => ({ x, y, robot: cell.robotId }));
}

export function getCurrentGoalSeed(game: Game): number | undefined {
  const goal = game.goal;
  if (goal == undefined) {
    return undefined;
  }

  const goals = getGoals(game.grid);

  return goals.findIndex(
    (g) => g.robot == goal.robot && g.x == goal.x && g.y == goal.y
  );
}

export function canAddMove(game: Game, move: Move): boolean {
  const currentPositions = getCurrentPositions(game);
  return canMoveDirection(
    game.grid,
    currentPositions,
    currentPositions[move.robot],
    move.direction
  );
}

// TODO: I can probably make this much faster via iteration
export const getCurrentPositions2 = memoize(
  (game: Game): Record<RobotId, Position> => {
    if (game.moves.length == 0) {
      return game.startPositions;
    } else {
      const moves = [...game.moves];
      const move = moves.pop()!;
      const lastPositions = getCurrentPositions({ ...game, moves });

      const robot = move.robot;
      let newPosition = lastPositions[robot].slice() as Position;

      while (
        canMoveDirection(game.grid, lastPositions, newPosition, move.direction)
      ) {
        newPosition = stepDirection(newPosition, move.direction);
      }

      return { ...lastPositions, [robot]: newPosition };
    }
  }
);

export const getCurrentPositions = memoize(
  (game: Game): Record<RobotId, Position> => {
    const positions = { ...game.startPositions };

    for (const move of game.moves) {
      const robot = move.robot;
      while (
        canMoveDirection(game.grid, positions, positions[robot], move.direction)
      ) {
        positions[robot] = stepDirection(positions[robot], move.direction);
      }
    }

    return positions;
  }
);

export function canMoveDirection(
  grid: Grid,
  positions: Record<RobotId, Position>,
  position: Position,
  direction: Direction
): boolean {
  const [oldX, oldY] = position;
  const newPosition = stepDirection(position, direction);
  const [newX, newY] = newPosition;
  if (
    newX < 0 ||
    newX >= grid.cells.length ||
    newY < 0 ||
    newY >= grid.cells[0].length
  ) {
    return false;
  }

  const occupied = Object.values(positions);

  if (occupied.some(([ox, oy]) => ox == newX && oy == newY)) {
    return false;
  }

  if (direction == "up" && grid.walls[oldX][oldY].horizontal) {
    return false;
  }
  if (direction == "down" && grid.walls[oldX][oldY + 1].horizontal) {
    return false;
  }
  if (direction == "left" && grid.walls[oldX][oldY].vertical) {
    return false;
  }
  if (direction == "right" && grid.walls[oldX + 1][oldY].vertical) {
    return false;
  }

  return true;
}

export function isGameSolved(game: Game): boolean {
  return (
    game.goal != null &&
    positionEquals(getCurrentPositions(game)[game.goal.robot], [
      game.goal.x,
      game.goal.y,
    ])
  );
}

function stepDirection([x, y]: Position, direction: Direction): Position {
  switch (direction) {
    case "up":
      return [x, y - 1];
    case "down":
      return [x, y + 1];
    case "left":
      return [x - 1, y];
    case "right":
      return [x + 1, y];
  }
}

function positionEquals([x1, y1], [x2, y2]): boolean {
  return x1 == x2 && y1 == y2;
}
