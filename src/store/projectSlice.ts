import type { StateCreator } from 'zustand';
import type { LayoutType } from '@/types/layout.ts';
import { generateId } from '@/utils/idGenerator.ts';

export interface ProjectSlice {
  projectId: string;
  projectName: string;
  layoutType: LayoutType;
  createdAt: string;
  updatedAt: string;

  setProjectName: (name: string) => void;
  setLayoutType: (type: LayoutType) => void;
  newProject: () => void;
  touchUpdatedAt: () => void;
}

export const createProjectSlice: StateCreator<ProjectSlice, [], [], ProjectSlice> = (set) => ({
  projectId: generateId('proj'),
  projectName: 'Untitled Project',
  layoutType: 'american-orchestra',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),

  setProjectName: (name) => set({ projectName: name, updatedAt: new Date().toISOString() }),

  setLayoutType: (type) => set({ layoutType: type, updatedAt: new Date().toISOString() }),

  newProject: () => set({
    projectId: generateId('proj'),
    projectName: 'Untitled Project',
    layoutType: 'american-orchestra',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }),

  touchUpdatedAt: () => set({ updatedAt: new Date().toISOString() }),
});
