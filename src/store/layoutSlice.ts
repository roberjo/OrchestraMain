import type { StateCreator } from 'zustand';
import type { SeatPosition, LayoutConfig } from '@/types/layout.ts';
import { getDefaultLayoutConfig } from '@/engine/layoutPresets.ts';

export interface LayoutSlice {
  seatPositions: Record<string, SeatPosition>;
  layoutConfig: LayoutConfig;

  setSeatPosition: (musicianId: string, position: Partial<SeatPosition>) => void;
  setSeatPositions: (positions: Record<string, SeatPosition>) => void;
  updateLayoutConfig: (config: Partial<LayoutConfig>) => void;
  resetLayoutConfig: () => void;
  clearPositions: () => void;
}

export const createLayoutSlice: StateCreator<LayoutSlice, [], [], LayoutSlice> = (set) => ({
  seatPositions: {},
  layoutConfig: getDefaultLayoutConfig('american-orchestra'),

  setSeatPosition: (musicianId, position) =>
    set((state) => ({
      seatPositions: {
        ...state.seatPositions,
        [musicianId]: { ...state.seatPositions[musicianId], ...position },
      },
    })),

  setSeatPositions: (positions) => set({ seatPositions: positions }),

  updateLayoutConfig: (config) =>
    set((state) => ({
      layoutConfig: { ...state.layoutConfig, ...config },
    })),

  resetLayoutConfig: () =>
    set((state) => ({
      layoutConfig: getDefaultLayoutConfig(state.layoutConfig.layoutType),
    })),

  clearPositions: () => set({ seatPositions: {} }),
});
