import type { StateCreator } from 'zustand';

export type ModalType = 'import' | 'export' | 'settings' | null;
export type SidebarTab = 'roster' | 'sections';

export interface UISlice {
  selectedSeatIds: string[];
  sidebarTab: SidebarTab;
  zoomLevel: number;
  stageOffsetX: number;
  stageOffsetY: number;
  activeModal: ModalType;

  selectSeat: (id: string, multi?: boolean) => void;
  deselectAll: () => void;
  setSidebarTab: (tab: SidebarTab) => void;
  setZoom: (zoom: number) => void;
  setStageOffset: (x: number, y: number) => void;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  selectedSeatIds: [],
  sidebarTab: 'roster',
  zoomLevel: 1,
  stageOffsetX: 0,
  stageOffsetY: 0,
  activeModal: null,

  selectSeat: (id, multi = false) =>
    set((state) => {
      if (multi) {
        const exists = state.selectedSeatIds.includes(id);
        return {
          selectedSeatIds: exists
            ? state.selectedSeatIds.filter((s) => s !== id)
            : [...state.selectedSeatIds, id],
        };
      }
      return { selectedSeatIds: [id] };
    }),

  deselectAll: () => set({ selectedSeatIds: [] }),

  setSidebarTab: (tab) => set({ sidebarTab: tab }),

  setZoom: (zoom) => set({ zoomLevel: Math.max(0.3, Math.min(3, zoom)) }),

  setStageOffset: (x, y) => set({ stageOffsetX: x, stageOffsetY: y }),

  openModal: (modal) => set({ activeModal: modal }),

  closeModal: () => set({ activeModal: null }),
});
