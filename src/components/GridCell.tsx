import React, { Fragment } from "react";
import { Cell } from "../game/grid";
import { classNames } from "./classNames";
import { SIZE, SPACING } from "./Grid";
import { robotToColor } from "./robotRenderUtils";

export function GridCell({
  i,
  j,
  cell,
  isGoal,
}: {
  i: number;
  j: number;
  cell: Cell;
  isGoal: boolean;
}) {
  return (
    <Fragment>
      <rect
        key={`${i},${j}`}
        x={i * SIZE + SPACING}
        y={j * SIZE + SPACING}
        width={SIZE - SPACING * 2}
        height={SIZE - SPACING * 2}
        className={cell.type == "BLOCKED" ? "fill-gray-500" : "fill-gray-50"}
      />
      {cell.type === "GOAL" && (
        <g
          transform={`translate(${(i + 0.5) * SIZE}, ${(j + 0.5) * SIZE})`}
          className={classNames(
            "transition-all duration-500",
            isGoal ? "" : "opacity-0 grayscale-[25%]"
          )}
        >
          <rect
            stroke={robotToColor(cell.robotId)}
            strokeWidth={0.75}
            width={0.7 * SIZE}
            height={0.7 * SIZE}
            x={-0.7 * 0.5 * SIZE}
            y={-0.7 * 0.5 * SIZE}
            fill={robotToColor(cell.robotId) + "33"}
          />
          <text
            fill={robotToColor(cell.robotId) + "dd"}
            textAnchor="middle"
            alignmentBaseline="central"
            fontSize={SIZE * 0.5}
            className="font-mono select-none"
          >
            {cell.number}
          </text>
        </g>
      )}
    </Fragment>
  );
}
