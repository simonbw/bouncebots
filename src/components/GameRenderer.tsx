import React, { useState } from "react";
import { canAddMove, getCurrentPositions } from "../game/game-helpers";
import { RobotId, ROBOT_IDS } from "../game/game-model";
import { Button } from "./Button";
import { GithubIcon } from "./GithubIcon";
import { Grid } from "./Grid";
import { Hourglass } from "./Hourglass";
import { HowToPlay } from "./HowToPlay";
import { MoveList } from "./MoveList";
import { RobotStartToken } from "./RobotStartToken";
import { RobotToken } from "./RobotToken";
import { ShareBox } from "./ShareBox";
import { useGame } from "./useGame";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";

export function GameRenderer() {
  const { game, newGoal } = useGame();
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
      <div className="flex flex-col justify-center max-md:order-10">
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

        {ROBOT_IDS.map((robot) => (
          <RobotToken
            key={robot}
            robotId={robot}
            isSelected={selected == robot}
            select={() => setSelected(robot)}
          />
        ))}
      </Grid>

      <div className="flex flex-col gap-4 h-full max-h-full">
        <MoveList />
        <Button
          block
          onClick={() => newGoal()}
          color="primary"
          kind="full"
          className="flex-shrink-0 shadow-md"
        >
          New Goal
        </Button>
        {/* TODO: Put SolutionPanel back in when solver doesn't crash page */}
        {/* <SolutionPanel /> */}
        <div className="flex flex-col items-end">
          <HowToPlay />
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
