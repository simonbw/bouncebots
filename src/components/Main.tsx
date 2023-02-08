import React from "react";
import { GameProvider } from "./useGame";
import { GameRenderer } from "./GameRenderer";

export function Main() {
  return (
    <GameProvider>
      <GameRenderer />
    </GameProvider>
  );
}
