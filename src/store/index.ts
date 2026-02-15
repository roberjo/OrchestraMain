import { create } from 'zustand';
import { createProjectSlice, type ProjectSlice } from './projectSlice.ts';
import { createRosterSlice, type RosterSlice } from './rosterSlice.ts';
import { createLayoutSlice, type LayoutSlice } from './layoutSlice.ts';
import { createUISlice, type UISlice } from './uiSlice.ts';
import { createHistorySlice, type HistorySlice } from './historySlice.ts';
import { createWedgeSlice, type WedgeSlice } from './wedgeSlice.ts';

export type AppStore = ProjectSlice & RosterSlice & LayoutSlice & UISlice & HistorySlice & WedgeSlice;

export const useStore = create<AppStore>()((...args) => ({
  ...createProjectSlice(...args),
  ...createRosterSlice(...args),
  ...createLayoutSlice(...args),
  ...createUISlice(...args),
  ...createHistorySlice(...args),
  ...createWedgeSlice(...args),
}));
