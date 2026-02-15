import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '@/store/index.ts';
import type { Musician } from '@/types/musician.ts';
import { nanoid } from 'nanoid';

describe('Zustand Store', () => {
  beforeEach(() => {
    // Reset store to initial state
    useStore.setState({
      projectName: 'Untitled Project',
      musicians: {},
      seatPositions: {},
      selectedSeatIds: [],
      undoStack: [],
      redoStack: [],
      wedges: {},
      selectedWedgeId: null,
    });
  });

  describe('Roster Slice', () => {
    it('should add musician', () => {
      const musician: Musician = {
        id: nanoid(),
        name: 'John',
        instrument: 'Violin',
        section: 'strings',
        chair: 1,
      };

      useStore.getState().addMusician(musician);
      const state = useStore.getState();

      expect(state.musicians[musician.id]).toEqual(musician);
    });

    it('should update musician', () => {
      const musician: Musician = {
        id: nanoid(),
        name: 'John',
        instrument: 'Violin',
        section: 'strings',
        chair: 1,
      };

      useStore.getState().addMusician(musician);
      useStore.getState().updateMusician(musician.id, { name: 'Jane' });

      const state = useStore.getState();
      expect(state.musicians[musician.id].name).toBe('Jane');
    });

    it('should remove musician', () => {
      const musician: Musician = {
        id: nanoid(),
        name: 'John',
        instrument: 'Violin',
        section: 'strings',
        chair: 1,
      };

      useStore.getState().addMusician(musician);
      useStore.getState().removeMusician(musician.id);

      const state = useStore.getState();
      expect(state.musicians[musician.id]).toBeUndefined();
    });

    it('should import multiple musicians', () => {
      const musicians: Musician[] = [
        { id: nanoid(), name: 'John', instrument: 'Violin', section: 'strings', chair: 1 },
        { id: nanoid(), name: 'Jane', instrument: 'Flute', section: 'woodwinds', chair: 1 },
      ];

      useStore.getState().importMusicians(musicians);
      const state = useStore.getState();

      expect(Object.keys(state.musicians)).toHaveLength(2);
    });
  });

  describe('Layout Slice', () => {
    it('should set seat position', () => {
      const musicianId = nanoid();
      useStore.getState().setSeatPosition(musicianId, { x: 100, y: 50, angle: 0, row: 0, isManuallyPlaced: false });

      const state = useStore.getState();
      expect(state.seatPositions[musicianId]).toBeDefined();
      expect(state.seatPositions[musicianId].x).toBe(100);
      expect(state.seatPositions[musicianId].y).toBe(50);
    });

    it('should update seat position', () => {
      const musicianId = nanoid();
      useStore.getState().setSeatPosition(musicianId, { x: 100, y: 50, angle: 0, row: 0, isManuallyPlaced: false });
      useStore.getState().setSeatPosition(musicianId, { x: 200 });

      const state = useStore.getState();
      expect(state.seatPositions[musicianId].x).toBe(200);
      expect(state.seatPositions[musicianId].y).toBe(50);
    });
  });

  describe('UI Slice', () => {
    it('should select seat', () => {
      const musicianId = nanoid();
      useStore.getState().selectSeat(musicianId);

      const state = useStore.getState();
      expect(state.selectedSeatIds).toContain(musicianId);
    });

    it('should deselect all seats', () => {
      useStore.getState().selectSeat(nanoid());
      useStore.getState().selectSeat(nanoid());
      useStore.getState().deselectAll();

      const state = useStore.getState();
      expect(state.selectedSeatIds).toHaveLength(0);
    });

    it('should set zoom', () => {
      useStore.getState().setZoom(2);
      expect(useStore.getState().zoomLevel).toBe(2);
    });

    it('should set stage offset', () => {
      useStore.getState().setStageOffset(100, 200);

      const state = useStore.getState();
      expect(state.stageOffsetX).toBe(100);
      expect(state.stageOffsetY).toBe(200);
    });
  });

  describe('Wedge Slice', () => {
    it('should add a wedge', () => {
      const id = useStore.getState().addWedge('Strings', ['m1', 'm2'], '#4A90D9');
      const state = useStore.getState();

      expect(state.wedges[id]).toBeDefined();
      expect(state.wedges[id].name).toBe('Strings');
      expect(state.wedges[id].seatIds).toEqual(['m1', 'm2']);
      expect(state.wedges[id].locked).toBe(true);
    });

    it('should remove a wedge', () => {
      const id = useStore.getState().addWedge('Strings', ['m1'], '#4A90D9');
      useStore.getState().removeWedge(id);

      expect(useStore.getState().wedges[id]).toBeUndefined();
    });

    it('should update a wedge', () => {
      const id = useStore.getState().addWedge('Strings', ['m1'], '#4A90D9');
      useStore.getState().updateWedge(id, { name: 'Renamed', locked: false });

      const wedge = useStore.getState().wedges[id];
      expect(wedge.name).toBe('Renamed');
      expect(wedge.locked).toBe(false);
    });

    it('should select and deselect a wedge', () => {
      const id = useStore.getState().addWedge('Strings', ['m1'], '#4A90D9');
      useStore.getState().selectWedge(id);
      expect(useStore.getState().selectedWedgeId).toBe(id);

      useStore.getState().selectWedge(null);
      expect(useStore.getState().selectedWedgeId).toBeNull();
    });

    it('should find wedge for a seat', () => {
      useStore.getState().addWedge('Strings', ['m1', 'm2', 'm3'], '#4A90D9');

      const wedge = useStore.getState().getWedgeForSeat('m2');
      expect(wedge).not.toBeNull();
      expect(wedge!.name).toBe('Strings');

      const noWedge = useStore.getState().getWedgeForSeat('m99');
      expect(noWedge).toBeNull();
    });

    it('should clear all wedges', () => {
      useStore.getState().addWedge('Strings', ['m1'], '#4A90D9');
      useStore.getState().addWedge('Brass', ['m2'], '#E8A838');
      useStore.getState().clearWedges();

      expect(Object.keys(useStore.getState().wedges)).toHaveLength(0);
      expect(useStore.getState().selectedWedgeId).toBeNull();
    });

    it('should deselect wedge when removing selected wedge', () => {
      const id = useStore.getState().addWedge('Strings', ['m1'], '#4A90D9');
      useStore.getState().selectWedge(id);
      useStore.getState().removeWedge(id);

      expect(useStore.getState().selectedWedgeId).toBeNull();
    });
  });

  describe('History Slice', () => {
    it('should push history entry', () => {
      const positions = { m1: { musicianId: 'm1', x: 100, y: 50, angle: 0, row: 0, isManuallyPlaced: false } };
      useStore.getState().pushHistory(positions, 'Test move');

      const state = useStore.getState();
      expect(state.undoStack).toHaveLength(1);
    });

    it('should undo', () => {
      const positions1 = { m1: { musicianId: 'm1', x: 100, y: 50, angle: 0, row: 0, isManuallyPlaced: false } };
      const positions2 = { m1: { musicianId: 'm1', x: 200, y: 100, angle: 0, row: 0, isManuallyPlaced: false } };

      useStore.getState().pushHistory(positions1, 'Move 1');
      useStore.getState().pushHistory(positions2, 'Move 2');

      const result = useStore.getState().undo();

      expect(result).toEqual(positions1);
    });

    it('should redo', () => {
      const positions = { m1: { musicianId: 'm1', x: 100, y: 50, angle: 0, row: 0, isManuallyPlaced: false } };

      useStore.getState().pushHistory(positions, 'Move');
      useStore.getState().undo();
      const result = useStore.getState().redo();

      expect(result?.m1.x).toBe(100);
    });

    it('should respect max history size', () => {
      const positions = { m1: { musicianId: 'm1', x: 100, y: 50, angle: 0, row: 0, isManuallyPlaced: false } };

      // Push 60 entries (max is 50)
      for (let i = 0; i < 60; i++) {
        useStore.getState().pushHistory(positions, `Move ${i}`);
      }

      const state = useStore.getState();
      expect(state.undoStack.length).toBeLessThanOrEqual(50);
    });

    it('should clear redo stack on new history entry', () => {
      const positions = { m1: { musicianId: 'm1', x: 100, y: 50, angle: 0, row: 0, isManuallyPlaced: false } };

      useStore.getState().pushHistory(positions, 'Move 1');
      useStore.getState().undo();
      expect(useStore.getState().redoStack).toHaveLength(1);

      // Push new entry
      useStore.getState().pushHistory(positions, 'Move 2');
      expect(useStore.getState().redoStack).toHaveLength(0);
    });
  });
});
