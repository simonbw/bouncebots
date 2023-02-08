import React, { useState } from "react";
import {
  canAddMove,
  getCurrentGoalSeed,
  getCurrentPositions,
} from "../game/game-helpers";
import { RobotId } from "../game/game-model";
import { Button } from "./Button";
import { Grid } from "./Grid";
import { MoveList } from "./MoveList";
import { RobotStartToken } from "./RobotStartToken";
import { RobotToken } from "./RobotToken";
import { SolutionPanel } from "./SolutionPanel";
import { useGame } from "./useGame";
import { useDocumentClick, useKeyDown } from "./useKeyDown";

export function GameRenderer() {
  const { game, addMove, clearMoves, undoMove, newGoal } = useGame();
  const { grid, startPositions, moves } = game;
  const currentPositions = getCurrentPositions(game);

  const [selected, setSelected] = useState<RobotId | null>(null);

  useKeyDown((event) => {
    if (event.key == "Escape") {
      setSelected(null);
    }

    if (event.key == "ArrowRight" && selected != null) {
      addMove({ robot: selected, direction: "right" });
    }
    if (event.key == "ArrowLeft" && selected != null) {
      addMove({ robot: selected, direction: "left" });
    }
    if (event.key == "ArrowUp" && selected != null) {
      addMove({ robot: selected, direction: "up" });
    }
    if (event.key == "ArrowDown" && selected != null) {
      addMove({ robot: selected, direction: "down" });
    }

    if (event.key == "z" && (event.ctrlKey || event.metaKey)) {
      undoMove();
    }
  });

  useDocumentClick(() => {
    setSelected(null);
  });

  return (
    <div
      className={
        "w-full flex justify-center gap-4 p-4 bg-gray-200 overflow-hidden flex-col md:flex-row md:max-h-screen md:h-full "
      }
    >
      <Grid>
        {Object.entries(startPositions).map(([robotId, [x, y]]) => (
          <RobotStartToken
            key={robotId}
            robotId={robotId as RobotId}
            x={x}
            y={y}
          />
        ))}

        {Object.entries(currentPositions).map(([robot, [x, y]]) => (
          <RobotToken
            key={robot}
            robotId={robot as RobotId}
            x={x}
            y={y}
            addMove={addMove}
            isSelected={selected == robot}
            select={() => setSelected(robot as RobotId)}
            canMoveDirection={(direction) =>
              canAddMove(game, { robot: robot as RobotId, direction })
            }
          />
        ))}
      </Grid>

      <div className="flex flex-col gap-4 h-full max-h-full">
        <MoveList />
        <SolutionPanel />
        <ShareBox />
      </div>
    </div>
  );
}

function ShareBox() {
  const { game } = useGame();

  const params = new URLSearchParams();
  params.append("seed", String(game.seed));
  const goalSeed = getCurrentGoalSeed(game);
  if (goalSeed) {
    params.append("goal", String(goalSeed));
  }

  const url = window.location.pathname + "?" + params.toString();

  return (
    <a className="block" href={url}>
      <Button block className="w-full" kind="text">
        Link to this puzzle
      </Button>
    </a>
  );
}
