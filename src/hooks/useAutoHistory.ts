import { useEffect } from 'react';
import { useStore } from '@/store/index.ts';

/**
 * Automatically capture seat position changes to the undo/redo history
 * Debounced to avoid excessive history entries during dragging
 */
export function useAutoHistory(debounceMs = 300) {
  const seatPositions = useStore((s) => s.seatPositions);
  const pushHistory = useStore((s) => s.pushHistory);
  const undoStack = useStore((s) => s.undoStack);

  useEffect(() => {
    // Skip if this is the first render (no history change)
    if (undoStack.length === 0) {
      // Push initial state
      pushHistory(seatPositions, 'Initial layout');
      return;
    }

    // Debounce the history push
    const timeoutId = setTimeout(() => {
      const lastEntry = undoStack[undoStack.length - 1];
      // Only push if the positions actually changed
      if (JSON.stringify(lastEntry?.seatPositions) !== JSON.stringify(seatPositions)) {
        pushHistory(seatPositions, 'Layout updated');
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [seatPositions, pushHistory, undoStack, debounceMs]);
}
