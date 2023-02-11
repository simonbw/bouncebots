import { RobotId } from "../game/game-model";
import { useGame } from "./useGame";
import { useDocumentClick, useKeyDown } from "./useKeyDown";

export function useKeyboardShortcuts(
  selected: RobotId | null,
  setSelected: (robotId: RobotId | null) => void
) {
  const { addMove, undoMove, clearMoves } = useGame();

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

    if (event.key == "r") {
      clearMoves();
    }
  });

  useDocumentClick(() => {
    setSelected(null);
  });
}
