import React from "react";
import { Direction, Move, RobotId } from "../game-model";
import { classNames } from "./classNames";
import { SIZE } from "./Grid";
import { robotToColor } from "./robotRenderUtils";

/**
 * Marks where a robot is right now.
 */
export function RobotToken({
  robotId,
  x,
  y,
  isSelected,
  addMove,
  select,
  canMoveDirection,
}: {
  robotId: RobotId;
  x: number;
  y: number;
  isSelected: boolean;
  addMove: (move: Move) => void;
  select: () => void;
  canMoveDirection: (direction: Direction) => boolean;
}) {
  return (
    <g
      transform={`translate(${(x + 0.5) * SIZE},${(y + 0.5) * SIZE})`}
      className="cursor-pointer transition-all"
      onClick={(event) => {
        select();
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <circle
        key={robotId}
        fill={robotToColor(robotId)}
        r={SIZE * 0.3}
        className={classNames(
          isSelected ? "scale-110" : "",
          "hover:scale-125 transition-all drop-shadow-sm hover:drop-shadow-md stroke-[0.1] stroke-white"
        )}
      />

      <Arrow
        enabled={isSelected && canMoveDirection("up")}
        direction="up"
        color={robotToColor(robotId)}
        onClick={() => addMove({ robot: robotId, direction: "up" })}
      />
      <Arrow
        enabled={isSelected && canMoveDirection("right")}
        direction="right"
        color={robotToColor(robotId)}
        onClick={() => addMove({ robot: robotId, direction: "right" })}
      />
      <Arrow
        enabled={isSelected && canMoveDirection("down")}
        direction="down"
        color={robotToColor(robotId)}
        onClick={() => addMove({ robot: robotId, direction: "down" })}
      />
      <Arrow
        enabled={isSelected && canMoveDirection("left")}
        direction="left"
        color={robotToColor(robotId)}
        onClick={() => addMove({ robot: robotId, direction: "left" })}
      />
    </g>
  );
}

function Arrow({
  enabled,
  color,
  direction,
  onClick,
}: {
  enabled: boolean;
  color: string;
  direction: Direction;
  onClick: () => void;
}) {
  const r1 = -SIZE * 0.4;
  const r2 = -SIZE * 0.7;
  const r3 = -SIZE * 1;
  const w1 = 1;
  const w2 = 2.7;
  return (
    <g transform={`rotate(${directionToRotation(direction)})`}>
      <g
        onClick={enabled ? onClick : undefined}
        tabIndex={enabled ? 0 : undefined}
        className={classNames(
          "drop-shadow-sm transition-all",
          "hover:scale-110 focus:scale-110 active:scale-125",
          "outline-none active:ouline-none focus:outline-none",
          enabled ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-label={`Move ${direction}`}
      >
        <polygon
          points={`${-w1},${r1} ${-w1},${r2} ${-w2},${r2} 0,${r3} ${w2},${r2} ${w1},${r2} ${w1},${r1}`}
          className="fill-white stroke-[0.25] stroke-gray-500"
        />
      </g>
    </g>
  );
}

function directionToRotation(direction: Direction): number {
  switch (direction) {
    case "up":
      return 0;
    case "right":
      return 90;
    case "down":
      return 180;
    case "left":
      return 270;
  }
}
