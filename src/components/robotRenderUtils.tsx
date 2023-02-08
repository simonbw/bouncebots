import { Direction, RobotId } from "../game-model";

export function robotToColor(robotId: RobotId): string {
  switch (robotId) {
    case "red":
      return "#ff0033";
    case "green":
      return "#00aa00";
    case "blue":
      return "#0000ff";
    case "yellow":
      return "#ffcc00";
  }
}

export function directionToArrow(direction: Direction): string {
  switch (direction) {
    case "up":
      return "↑";
    case "down":
      return "↓";
    case "left":
      return "←";
    case "right":
      return "→";
  }
}
