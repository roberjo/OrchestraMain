import type { StateCreator } from 'zustand';
import type { Musician } from '@/types/musician.ts';
import type { ExampleOrchestraConfig } from '@/utils/exampleData.ts';

export interface RosterSlice {
  musicians: Record<string, Musician>;

  addMusician: (musician: Musician) => void;
  removeMusician: (id: string) => void;
  updateMusician: (id: string, updates: Partial<Musician>) => void;
  importMusicians: (musicians: Musician[]) => void;
  loadExample: (example: ExampleOrchestraConfig) => void;
  clearRoster: () => void;
}

export const createRosterSlice: StateCreator<RosterSlice, [], [], RosterSlice> = (set) => ({
  musicians: {},

  addMusician: (musician) =>
    set((state) => ({
      musicians: { ...state.musicians, [musician.id]: musician },
    })),

  removeMusician: (id) =>
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: _removed, ...rest } = state.musicians;
      return { musicians: rest };
    }),

  updateMusician: (id, updates) =>
    set((state) => ({
      musicians: {
        ...state.musicians,
        [id]: { ...state.musicians[id], ...updates },
      },
    })),

  importMusicians: (musicians) =>
    set(() => {
      const record: Record<string, Musician> = {};
      for (const m of musicians) {
        record[m.id] = m;
      }
      return { musicians: record };
    }),

  loadExample: (example) =>
    set(() => {
      const record: Record<string, Musician> = {};
      for (const m of example.musicians) {
        record[m.id] = m;
      }
      return { musicians: record };
    }),

  clearRoster: () => set({ musicians: {} }),
});
