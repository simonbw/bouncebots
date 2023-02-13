import React from "react";
import { isGameSolved } from "../game/game-helpers";
import { Button } from "./Button";
import { directionToArrow, robotToColor } from "./robotRenderUtils";
import { useGame } from "./useGame";

export function MoveList({}: {}) {
  const { clearMoves, undoMove, game } = useGame();

  return (
    <div className="bg-gray-50 p-4 rounded shadow-md overflow-auto flex flex-col w-full min-w-48">
      <h2 className="text-2xl font-bold">Moves</h2>
      <div className="flex gap-2">
        <Button
          className="flex-grow"
          title="Undo [⌘+Z]"
          disabled={game.moves.length == 0}
          onClick={() => undoMove()}
          kind="full"
        >
          Undo
        </Button>
        <Button
          className="flex-grow"
          onClick={() => clearMoves()}
          disabled={game.moves.length == 0}
          title="Rest Moves [R]"
          kind="full"
        >
          Reset
        </Button>
      </div>

      <ol className="py-2 overflow-auto grid flex-wrap gap-1 grid-cols-2 items-start">
        {game.moves.length == 0 && (
          <li className="py-1 text-gray-600 italic text-sm text-center col-span-2">
            No moves yet
          </li>
        )}
        {game.moves.map((move, i) => (
          <li
            key={i}
            title={`${move.robot} moved ${move.direction}`}
            className="text-xl px-2 md:flex border rounded-full select-none inline-flex items-center justify-center"
            style={{
              color: robotToColor(move.robot),
              borderColor: robotToColor(move.robot),
            }}
          >
            <span className="mr-2 text-sm align-middle inline-block">
              {i + 1}
            </span>
            <span className="mr-2 hidden md:inline-block">●</span>
            <span className="inline-block">
              {directionToArrow(move.direction)}
            </span>
          </li>
        ))}
      </ol>
      {isGameSolved(game) && (
        <div className="text-lg font-bold">
          Solved in {game.moves.length}{" "}
          {game.moves.length === 1 ? "move" : "moves"}!
        </div>
      )}
    </div>
  );
}
