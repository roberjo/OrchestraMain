import { describe, it, expect } from 'vitest';
import {
  LAYOUT_PRESETS,
  getDefaultLayoutConfig,
  PRESET_AMERICAN_ORCHESTRA,
  PRESET_GERMAN_ORCHESTRA,
  PRESET_CONCERT_BAND,
} from '@/engine/layoutPresets.ts';

describe('layoutPresets', () => {
  describe('LAYOUT_PRESETS', () => {
    it('should contain all three presets', () => {
      expect(LAYOUT_PRESETS['american-orchestra']).toBeDefined();
      expect(LAYOUT_PRESETS['german-orchestra']).toBeDefined();
      expect(LAYOUT_PRESETS['concert-band']).toBeDefined();
    });

    it('should have display names for all presets', () => {
      for (const preset of Object.values(LAYOUT_PRESETS)) {
        expect(preset.displayName.length).toBeGreaterThan(0);
        expect(preset.description.length).toBeGreaterThan(0);
      }
    });

    it('should have section arc assignments for all presets', () => {
      for (const preset of Object.values(LAYOUT_PRESETS)) {
        expect(preset.sectionArcAssignments.length).toBeGreaterThan(0);
      }
    });
  });

  describe('preset configurations', () => {
    it('American orchestra should have strings in priority 1', () => {
      const stringsAssignment = PRESET_AMERICAN_ORCHESTRA.sectionArcAssignments.find(
        (a) => a.family === 'strings',
      );
      expect(stringsAssignment?.priority).toBe(1);
    });

    it('Concert band should not have strings assignment', () => {
      const stringsAssignment = PRESET_CONCERT_BAND.sectionArcAssignments.find(
        (a) => a.family === 'strings',
      );
      expect(stringsAssignment).toBeUndefined();
    });

    it('Concert band should have woodwinds in front rows', () => {
      const woodwindsAssignment = PRESET_CONCERT_BAND.sectionArcAssignments.find(
        (a) => a.family === 'woodwinds',
      );
      expect(woodwindsAssignment?.arcRows).toContain(0);
      expect(woodwindsAssignment?.priority).toBe(1);
    });

    it('German orchestra should have same structure as American', () => {
      expect(PRESET_GERMAN_ORCHESTRA.sectionArcAssignments.length).toBe(
        PRESET_AMERICAN_ORCHESTRA.sectionArcAssignments.length,
      );
    });
  });

  describe('getDefaultLayoutConfig', () => {
    it('should return valid config for american-orchestra', () => {
      const config = getDefaultLayoutConfig('american-orchestra');

      expect(config.layoutType).toBe('american-orchestra');
      expect(config.stageWidth).toBeGreaterThan(0);
      expect(config.stageHeight).toBeGreaterThan(0);
      expect(config.conductorX).toBeGreaterThan(0);
      expect(config.conductorY).toBeGreaterThan(0);
      expect(config.innerRadius).toBeGreaterThan(0);
      expect(config.rowSpacing).toBeGreaterThan(0);
      expect(config.seatRadius).toBeGreaterThan(0);
      expect(config.arcSpanAngle).toBeGreaterThan(0);
      expect(config.minSeatSpacing).toBeGreaterThan(0);
    });

    it('should return different configs for different types', () => {
      const american = getDefaultLayoutConfig('american-orchestra');
      const band = getDefaultLayoutConfig('concert-band');

      // Concert band typically has different arc span than orchestra
      expect(band.arcSpanAngle).not.toBe(american.arcSpanAngle);
    });

    it('should place conductor near the bottom center of the stage', () => {
      const config = getDefaultLayoutConfig('american-orchestra');

      // Conductor should be roughly centered horizontally
      expect(Math.abs(config.conductorX - config.stageWidth / 2)).toBeLessThan(config.stageWidth / 4);

      // Conductor should be in the bottom half
      expect(config.conductorY).toBeGreaterThan(config.stageHeight / 2);
    });
  });
});
