import React, { createContext, useContext, useState } from "react";
import {
  addMove,
  chooseGoal,
  clearMoves,
  undoMove,
} from "../game/game-actions";
import {
  canAddMove,
  getCurrentPositions,
  isGameSolved,
} from "../game/game-helpers";
import { Game, makeGame, Move } from "../game/game-model";

type GameContextValue = {
  game: Game;
  addMove: (move: Move) => void;
  undoMove: () => void;
  clearMoves: () => void;
  newGoal: () => void;
};

export function useGame(): GameContextValue {
  return useContext(GameContext);
}

const GameContext = createContext<GameContextValue>({
  game: null as any,
  addMove: () => null,
  undoMove: () => null,
  clearMoves: () => null,
  newGoal: () => null,
});

const GameContextProvider = GameContext.Provider;

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState(() => makeGame());

  const value = {
    game,
    addMove: (move: Move) => {
      if (canAddMove(game, move)) {
        setGame((g) => addMove(g, move));
      }
    },
    undoMove: () => setGame((g) => undoMove(g)),
    clearMoves: () => setGame((g) => clearMoves(g)),
    newGoal: () =>
      setGame((g) => {
        if (isGameSolved(g)) {
          g = {
            ...g,
            startPositions: getCurrentPositions(g),
          };
        }
        return chooseGoal(clearMoves(g));
      }),
  };

  return <GameContextProvider value={value}>{children}</GameContextProvider>;
}
