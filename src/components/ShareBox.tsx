import React from "react";
import { getCurrentGoalSeed } from "../game/game-helpers";
import { Button } from "./Button";
import { useGame } from "./useGame";

export function ShareBox() {
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
      <Button kind="text">Permalink to this puzzle</Button>
    </a>
  );
}
