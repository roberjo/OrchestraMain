import type { StateCreator } from 'zustand';
import type { Wedge } from '@/types/layout.ts';
import { nanoid } from 'nanoid';

export interface WedgeSlice {
  wedges: Record<string, Wedge>;
  selectedWedgeId: string | null;

  addWedge: (name: string, seatIds: string[], color: string) => string;
  removeWedge: (id: string) => void;
  updateWedge: (id: string, updates: Partial<Wedge>) => void;
  selectWedge: (id: string | null) => void;
  setWedges: (wedges: Record<string, Wedge>) => void;
  clearWedges: () => void;

  /** Get the wedge a seat belongs to (if any) */
  getWedgeForSeat: (seatId: string) => Wedge | null;
}

export const createWedgeSlice: StateCreator<WedgeSlice, [], [], WedgeSlice> = (set, get) => ({
  wedges: {},
  selectedWedgeId: null,

  addWedge: (name, seatIds, color) => {
    const id = nanoid();
    const wedge: Wedge = { id, name, seatIds, color, locked: true };
    set((state) => ({
      wedges: { ...state.wedges, [id]: wedge },
    }));
    return id;
  },

  removeWedge: (id) =>
    set((state) => {
      const { [id]: _, ...rest } = state.wedges;
      return {
        wedges: rest,
        selectedWedgeId: state.selectedWedgeId === id ? null : state.selectedWedgeId,
      };
    }),

  updateWedge: (id, updates) =>
    set((state) => {
      const existing = state.wedges[id];
      if (!existing) return state;
      return {
        wedges: { ...state.wedges, [id]: { ...existing, ...updates } },
      };
    }),

  selectWedge: (id) => set({ selectedWedgeId: id }),

  setWedges: (wedges) => set({ wedges }),

  clearWedges: () => set({ wedges: {}, selectedWedgeId: null }),

  getWedgeForSeat: (seatId) => {
    const { wedges } = get();
    for (const wedge of Object.values(wedges)) {
      if (wedge.seatIds.includes(seatId)) {
        return wedge;
      }
    }
    return null;
  },
});
