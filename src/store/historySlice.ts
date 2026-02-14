import type { StateCreator } from 'zustand';
import type { SeatPosition } from '@/types/layout.ts';

interface HistoryEntry {
  timestamp: number;
  seatPositions: Record<string, SeatPosition>;
  description: string;
}

const MAX_HISTORY = 50;

export interface HistorySlice {
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];

  pushHistory: (seatPositions: Record<string, SeatPosition>, description: string) => void;
  undo: () => Record<string, SeatPosition> | null;
  redo: () => Record<string, SeatPosition> | null;
  clearHistory: () => void;
}

export const createHistorySlice: StateCreator<HistorySlice, [], [], HistorySlice> = (set, get) => ({
  undoStack: [],
  redoStack: [],

  pushHistory: (seatPositions, description) =>
    set((state) => {
      const entry: HistoryEntry = {
        timestamp: Date.now(),
        seatPositions: { ...seatPositions },
        description,
      };
      const newStack = [...state.undoStack, entry];
      if (newStack.length > MAX_HISTORY) {
        newStack.shift();
      }
      return { undoStack: newStack, redoStack: [] };
    }),

  undo: () => {
    const state = get();
    if (state.undoStack.length === 0) return null;

    const newUndo = [...state.undoStack];
    const entry = newUndo.pop()!;

    set({
      undoStack: newUndo,
      redoStack: [...state.redoStack, entry],
    });

    // Return the previous positions (the one before the popped entry)
    if (newUndo.length > 0) {
      return newUndo[newUndo.length - 1].seatPositions;
    }
    return null;
  },

  redo: () => {
    const state = get();
    if (state.redoStack.length === 0) return null;

    const newRedo = [...state.redoStack];
    const entry = newRedo.pop()!;

    set({
      undoStack: [...state.undoStack, entry],
      redoStack: newRedo,
    });

    return entry.seatPositions;
  },

  clearHistory: () => set({ undoStack: [], redoStack: [] }),
});
