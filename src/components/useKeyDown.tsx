import { useEffect } from "react";

export function useKeyDown(callback: (event: KeyboardEvent) => void) {
  useEffect(() => {
    document.addEventListener("keydown", callback);
    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, [callback]);
}

export function useDocumentClick(callback: (event: MouseEvent) => void) {
  useEffect(() => {
    document.addEventListener("click", callback);
    return () => {
      document.removeEventListener("click", callback);
    };
  }, [callback]);
}
