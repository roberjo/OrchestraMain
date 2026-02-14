import { useEffect } from 'react';
import { useStore } from '@/store/index.ts';

/**
 * Handle keyboard shortcuts for undo/redo
 * Ctrl+Z: Undo
 * Ctrl+Y or Ctrl+Shift+Z: Redo
 */
export function useKeyboardShortcuts() {
  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);
  const setSeatPositions = useStore((s) => s.setSeatPositions);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        const positions = undo();
        if (positions) {
          setSeatPositions(positions);
        }
      }

      // Ctrl+Y or Ctrl+Shift+Z: Redo
      if (
        ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey)
      ) {
        e.preventDefault();
        const positions = redo();
        if (positions) {
          setSeatPositions(positions);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, setSeatPositions]);
}
