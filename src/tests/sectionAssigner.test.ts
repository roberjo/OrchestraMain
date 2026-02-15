import { describe, it, expect } from 'vitest';
import {
  groupMusiciansByInstrument,
  applyLayoutOverrides,
} from '@/engine/sectionAssigner.ts';
import type { Musician } from '@/types/musician.ts';

describe('sectionAssigner', () => {
  const createMusician = (
    id: string,
    name: string,
    instrument: string,
    section: 'strings' | 'woodwinds' | 'brass' | 'percussion' | 'keyboard' | 'other',
    chair: number | null = null,
  ): Musician => ({
    id,
    name,
    instrument,
    section,
    chair,
  });

  describe('groupMusiciansByInstrument', () => {
    it('should group musicians by instrument', () => {
      const musicians = [
        createMusician('1', 'Alice', 'violin-1', 'strings', 1),
        createMusician('2', 'Bob', 'violin-1', 'strings', 2),
        createMusician('3', 'Carol', 'flute', 'woodwinds', 1),
      ];

      const groups = groupMusiciansByInstrument(musicians);

      expect(groups.length).toBe(2);
      const violinGroup = groups.find((g) => g.instrumentId === 'violin-1');
      expect(violinGroup?.musicians.length).toBe(2);
    });

    it('should sort musicians by chair within each group', () => {
      const musicians = [
        createMusician('1', 'Alice', 'violin-1', 'strings', 3),
        createMusician('2', 'Bob', 'violin-1', 'strings', 1),
        createMusician('3', 'Carol', 'violin-1', 'strings', 2),
      ];

      const groups = groupMusiciansByInstrument(musicians);
      const violinGroup = groups.find((g) => g.instrumentId === 'violin-1')!;

      expect(violinGroup.musicians[0].chair).toBe(1);
      expect(violinGroup.musicians[1].chair).toBe(2);
      expect(violinGroup.musicians[2].chair).toBe(3);
    });

    it('should sort groups by family order (strings first, then woodwinds, etc.)', () => {
      const musicians = [
        createMusician('1', 'Alice', 'trumpet', 'brass', 1),
        createMusician('2', 'Bob', 'violin-1', 'strings', 1),
        createMusician('3', 'Carol', 'flute', 'woodwinds', 1),
      ];

      const groups = groupMusiciansByInstrument(musicians);

      expect(groups[0].family).toBe('strings');
      expect(groups[1].family).toBe('woodwinds');
      expect(groups[2].family).toBe('brass');
    });

    it('should return empty array for no musicians', () => {
      expect(groupMusiciansByInstrument([])).toEqual([]);
    });

    it('should skip musicians with unknown instruments', () => {
      const musicians = [
        createMusician('1', 'Alice', 'theremin', 'other', 1), // Not in taxonomy
        createMusician('2', 'Bob', 'violin-1', 'strings', 1),
      ];

      const groups = groupMusiciansByInstrument(musicians);
      // theremin is not in INSTRUMENTS, so it should be skipped
      expect(groups.length).toBe(1);
      expect(groups[0].instrumentId).toBe('violin-1');
    });

    it('should assign default arc rows from taxonomy', () => {
      const musicians = [
        createMusician('1', 'Alice', 'violin-1', 'strings'),
        createMusician('2', 'Bob', 'trumpet', 'brass'),
      ];

      const groups = groupMusiciansByInstrument(musicians);
      const violinGroup = groups.find((g) => g.instrumentId === 'violin-1')!;
      const trumpetGroup = groups.find((g) => g.instrumentId === 'trumpet')!;

      expect(violinGroup.defaultArcRow).toBe(0); // Strings in front
      expect(trumpetGroup.defaultArcRow).toBe(4); // Brass in back
    });
  });

  describe('applyLayoutOverrides', () => {
    it('should apply German layout overrides for violin-2', () => {
      const musicians = [
        createMusician('1', 'Alice', 'violin-2', 'strings'),
      ];

      const groups = groupMusiciansByInstrument(musicians);
      const germanGroups = applyLayoutOverrides(groups, 'german-orchestra');

      const vln2 = germanGroups.find((g) => g.instrumentId === 'violin-2')!;
      // German layout puts 2nd violins on the right (0.70-0.95)
      expect(vln2.defaultAngularZone[0]).toBeCloseTo(0.70, 2);
      expect(vln2.defaultAngularZone[1]).toBeCloseTo(0.95, 2);
    });

    it('should not modify American layout', () => {
      const musicians = [
        createMusician('1', 'Alice', 'violin-2', 'strings'),
      ];

      const groups = groupMusiciansByInstrument(musicians);
      const americanGroups = applyLayoutOverrides(groups, 'american-orchestra');

      const vln2 = americanGroups.find((g) => g.instrumentId === 'violin-2')!;
      // American layout keeps 2nd violins left-center (0.30-0.50)
      expect(vln2.defaultAngularZone[0]).toBeCloseTo(0.30, 2);
      expect(vln2.defaultAngularZone[1]).toBeCloseTo(0.50, 2);
    });

    it('should adjust cello position for German layout', () => {
      const musicians = [
        createMusician('1', 'Alice', 'cello', 'strings'),
      ];

      const groups = groupMusiciansByInstrument(musicians);
      const germanGroups = applyLayoutOverrides(groups, 'german-orchestra');

      const cello = germanGroups.find((g) => g.instrumentId === 'cello')!;
      // German layout: cellos left-center (0.30-0.50)
      expect(cello.defaultAngularZone[0]).toBeCloseTo(0.30, 2);
    });
  });
});
