import React, { useEffect, useState } from "react";
import { Game } from "../game/game-model";
import { Solver } from "../game/solver";
import { useGame } from "./useGame";

export function SolutionPanel() {
  const { game } = useGame();

  const [solver, setSolver] = useState(() => new Solver(game));

  const [iterations, setIterations] = useState(0);
  const [solution, setSolution] = useState<Game | undefined>(undefined);

  useEffect(() => {
    setSolver(new Solver(game));
  }, [game]);

  useEffect(() => {
    setSolution(solver.solution);
    setIterations(solver.iterations);

    const ref = setInterval(() => {
      if (!solver.solution) {
        const startTime = performance.now();
        while (performance.now() - startTime < 10) {
          solver.doIteration();
        }
        setSolution(solver.solution);
        setIterations(solver.iterations);
      }
    }, 0);
    return () => {
      clearInterval(ref);
    };
  }, [solver]);

  return (
    <div className="text-xs text-gray-700">
      {solution ? (
        <span>
          Solution in {solution.moves.length - game.moves.length} moves
        </span>
      ) : (
        <span>
          Solving... {solver.options[0].moves.length - game.moves.length}
        </span>
      )}
    </div>
  );
}
