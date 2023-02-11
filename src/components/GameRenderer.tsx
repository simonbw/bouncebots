import React, { useState } from "react";
import {
  canAddMove,
  getCurrentGoalSeed,
  getCurrentPositions,
} from "../game/game-helpers";
import { RobotId } from "../game/game-model";
import { Button } from "./Button";
import { GithubIcon } from "./GithubIcon";
import { Grid } from "./Grid";
import { Hourglass } from "./Hourglass";
import { MoveList } from "./MoveList";
import { RobotStartToken } from "./RobotStartToken";
import { RobotToken } from "./RobotToken";
import { useGame } from "./useGame";
import { useDocumentClick, useKeyDown } from "./useKeyDown";

export function GameRenderer() {
  const { game, addMove, undoMove } = useGame();
  const { startPositions } = game;
  const currentPositions = getCurrentPositions(game);

  const [selected, setSelected] = useState<RobotId | null>(null);
  useKeyboardShortcuts(selected, setSelected);

  return (
    <div
      className={
        "w-full min-h-full flex justify-center gap-4 p-4 bg-gray-200 overflow-hidden flex-col md:flex-row md:max-h-screen md:h-screen"
      }
    >
      <div className="flex flex-col justify-center">
        <Hourglass />
      </div>

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
        {/* TODO: Put SolutionPanel back in when solver doesn't crash page */}
        {/* <SolutionPanel /> */}
        <div className="flex items-center justify-between">
          <ShareBox />
          <a
            href="https://github.com/simonbw/bouncebots"
            target="_"
            title="View the code on github"
          >
            <Button kind="text" className="fill-gray-900">
              <GithubIcon />
            </Button>
          </a>
        </div>
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
    <a href={url}>
      <Button block className="w-full" kind="text">
        Permalink to this puzzle
      </Button>
    </a>
  );
}

function useKeyboardShortcuts(
  selected: RobotId | null,
  setSelected: (robotId: RobotId | null) => void
) {
  const { addMove, undoMove } = useGame();

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
}
