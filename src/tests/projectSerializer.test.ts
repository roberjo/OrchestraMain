import { describe, it, expect } from 'vitest';
import { serializeProject, deserializeProject, exportProjectAsJSON } from '@/utils/projectSerializer.ts';
import type { Musician } from '@/types/musician.ts';
import type { SeatPosition, LayoutConfig } from '@/types/layout.ts';

describe('projectSerializer', () => {
  const mockMusicians: Record<string, Musician> = {
    'm1': {
      id: 'm1',
      name: 'John Doe',
      instrument: 'Violin',
      section: 'strings',
      chair: 1,
    },
  };

  const mockSeatPositions: Record<string, SeatPosition> = {
    'm1': {
      musicianId: 'm1',
      x: 100,
      y: 150,
      angle: 0,
      row: 0,
      isManuallyPlaced: false,
    },
  };

  const mockLayoutConfig: LayoutConfig = {
    layoutType: 'american-orchestra',
    stageWidth: 800,
    stageHeight: 600,
    conductorX: 400,
    conductorY: 300,
    innerRadius: 100,
    rowSpacing: 50,
    seatRadius: 15,
    arcSpanAngle: Math.PI,
    minSeatSpacing: 30,
  };

  describe('serializeProject', () => {
    it('should create a valid project snapshot', () => {
      const snapshot = serializeProject(
        'Test Project',
        'american-orchestra',
        mockMusicians,
        mockSeatPositions,
        mockLayoutConfig
      );

      expect(snapshot.name).toBe('Test Project');
      expect(snapshot.layoutType).toBe('american-orchestra');
      expect(snapshot.musicians).toHaveLength(1);
      expect(snapshot.version).toBeDefined();
      expect(snapshot.timestamp).toBeDefined();
    });

    it('should preserve musician data', () => {
      const snapshot = serializeProject(
        'Test',
        'american-orchestra',
        mockMusicians,
        mockSeatPositions,
        mockLayoutConfig
      );

      expect(snapshot.musicians[0].name).toBe('John Doe');
      expect(snapshot.musicians[0].instrument).toBe('Violin');
    });

    it('should preserve seat positions', () => {
      const snapshot = serializeProject(
        'Test',
        'american-orchestra',
        mockMusicians,
        mockSeatPositions,
        mockLayoutConfig
      );

      expect(snapshot.seatPositions['m1'].x).toBe(100);
      expect(snapshot.seatPositions['m1'].y).toBe(150);
    });
  });

  describe('deserializeProject', () => {
    it('should deserialize valid JSON', () => {
      const snapshot = serializeProject(
        'Test',
        'american-orchestra',
        mockMusicians,
        mockSeatPositions,
        mockLayoutConfig
      );

      const json = JSON.stringify(snapshot);
      const deserialized = deserializeProject(json);

      expect(deserialized.name).toBe('Test');
      expect(deserialized.musicians[0].name).toBe('John Doe');
    });

    it('should throw on invalid JSON', () => {
      expect(() => deserializeProject('invalid json')).toThrow();
    });

    it('should throw on missing required fields', () => {
      const invalidSnapshot = { name: 'Test' };
      expect(() => deserializeProject(JSON.stringify(invalidSnapshot))).toThrow();
    });
  });

  describe('exportProjectAsJSON', () => {
    it('should export snapshot as formatted JSON', () => {
      const snapshot = serializeProject(
        'Test',
        'american-orchestra',
        mockMusicians,
        mockSeatPositions,
        mockLayoutConfig
      );

      const json = exportProjectAsJSON(snapshot);

      expect(json).toContain('"name"');
      expect(json).toContain('"Test"');
      expect(json).toContain('"musicians"');
    });

    it('should create valid JSON that can be parsed', () => {
      const snapshot = serializeProject(
        'Test',
        'american-orchestra',
        mockMusicians,
        mockSeatPositions,
        mockLayoutConfig
      );

      const json = exportProjectAsJSON(snapshot);
      const parsed = JSON.parse(json);

      expect(parsed.name).toBe('Test');
    });
  });
});
