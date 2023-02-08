import React from "react";
import { RobotId } from "../game-model";
import { SIZE } from "./Grid";
import { robotToColor } from "./robotRenderUtils";

/**
 * Marks where a robot starts at the beginning of the turn
 */
export function RobotStartToken({
  robotId,
  x,
  y,
}: {
  robotId: RobotId;
  x: number;
  y: number;
}) {
  return (
    <circle
      stroke={robotToColor(robotId)}
      strokeWidth={0.5}
      fill="none"
      transform={`translate(${(x + 0.5) * SIZE},${(y + 0.5) * SIZE})`}
      r={SIZE * 0.35}
    />
  );
}
