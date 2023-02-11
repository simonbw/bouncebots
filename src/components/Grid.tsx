import React, { Fragment, MouseEventHandler } from "react";
import { GridCell } from "./GridCell";
import { useGame } from "./useGame";

export const SPACING = 0.1;
export const SIZE = 10;
export const WALL_THICKNESS = 1.2;

interface GridProps {
  children: React.ReactNode;
  onClick?: MouseEventHandler;
}

export function Grid({ children, onClick }: GridProps) {
  const {
    game: { grid, goal },
  } = useGame();

  return (
    <svg
      viewBox={`${-WALL_THICKNESS / 2} ${-WALL_THICKNESS / 2} ${
        grid.cells.length * SIZE + WALL_THICKNESS
      } ${grid.cells[0].length * SIZE + WALL_THICKNESS}`}
      onClick={onClick}
      className="flex-grow-0 shadow-md"
    >
      {grid.cells.map((row, i) =>
        row.map((cell, j) => (
          <GridCell
            key={`${i},${j}`}
            i={i}
            j={j}
            cell={cell}
            isGoal={goal?.x == i && goal?.y == j}
          />
        ))
      )}

      {grid.walls.map((row, i) =>
        row.map(({ horizontal, vertical }, j) => (
          <Fragment key={`${i},${j}`}>
            {vertical && (
              <line
                x1={i * SIZE}
                y1={j * SIZE}
                x2={i * SIZE}
                y2={(j + 1) * SIZE}
                strokeLinecap="square"
                className="stroke-gray-500 stroke-[1.2]"
              />
            )}

            {horizontal && (
              <line
                x1={i * SIZE}
                y1={j * SIZE}
                x2={(i + 1) * SIZE}
                y2={j * SIZE}
                className="stroke-gray-500 stroke-[1.2]"
                strokeLinecap="square"
              />
            )}
          </Fragment>
        ))
      )}
      {children}
    </svg>
  );
}
