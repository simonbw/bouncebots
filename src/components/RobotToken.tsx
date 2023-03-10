import React from "react";
import { Direction, RobotId } from "../game-model";
import { canAddMove, getCurrentPositions } from "../game/game-helpers";
import { classNames } from "./classNames";
import { SIZE } from "./Grid";
import { robotToColor } from "./robotRenderUtils";
import { useGame } from "./useGame";

/**
 * Marks where a robot is right now.
 */
export function RobotToken({
  robotId,
  isSelected,
  select,
}: {
  robotId: RobotId;
  isSelected: boolean;
  select: () => void;
}) {
  const { addMove, game } = useGame();
  const [x, y] = getCurrentPositions(game)![robotId];
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
          "hover:scale-125 active:scale-[135%] transition-all drop-shadow-svg-sm hover:drop-shadow-svg-md stroke-[0.1] stroke-white"
        )}
      />

      <Arrow
        enabled={
          isSelected && canAddMove(game, { robot: robotId, direction: "up" })
        }
        direction="up"
        color={robotToColor(robotId)}
        onClick={() => addMove({ robot: robotId, direction: "up" })}
      />
      <Arrow
        enabled={
          isSelected && canAddMove(game, { robot: robotId, direction: "right" })
        }
        direction="right"
        color={robotToColor(robotId)}
        onClick={() => addMove({ robot: robotId, direction: "right" })}
      />
      <Arrow
        enabled={
          isSelected && canAddMove(game, { robot: robotId, direction: "down" })
        }
        direction="down"
        color={robotToColor(robotId)}
        onClick={() => addMove({ robot: robotId, direction: "down" })}
      />
      <Arrow
        enabled={
          isSelected && canAddMove(game, { robot: robotId, direction: "left" })
        }
        direction="left"
        color={robotToColor(robotId)}
        onClick={() => addMove({ robot: robotId, direction: "left" })}
      />
    </g>
  );
}

function Arrow({
  enabled,
  direction,
  onClick,
}: {
  enabled: boolean;
  color: string;
  direction: Direction;
  onClick: () => void;
}) {
  const r1 = -SIZE * 0.5;
  const r2 = -SIZE * 1.0;
  const r3 = -SIZE * 1.3;
  const w1 = 1.2;
  const w2 = 3.2;
  return (
    <g transform={`rotate(${directionToRotation(direction)})`}>
      <g
        onClick={enabled ? onClick : undefined}
        tabIndex={enabled ? 0 : undefined}
        className={classNames(
          "drop-shadow-svg-sm transition-all",
          "hover:scale-110 focus:scale-110 active:scale-125",
          "outline-none active:ouline-none focus:outline-none",
          enabled ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-label={`Move ${direction}`}
      >
        {/* Invisible one for bigger hitbox */}
        <polygon
          points={`${-w1},${r1} ${-w1},${r2} ${-w2},${r2} 0,${r3} ${w2},${r2} ${w1},${r2} ${w1},${r1}`}
          className="fill-transparent stroke-[3] stroke-transparent"
        />
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
    default:
      throw new Error("invalid direction: " + direction);
  }
}
