import { describe, it, expect } from 'vitest';
import { computeAdaptiveConfig } from '@/engine/spacingCalculator.ts';
import { getDefaultLayoutConfig } from '@/engine/layoutPresets.ts';

describe('spacingCalculator', () => {
  describe('computeAdaptiveConfig', () => {
    const baseConfig = getDefaultLayoutConfig('american-orchestra');

    it('should increase seat radius for small ensembles (<=15)', () => {
      const config = computeAdaptiveConfig(10, baseConfig);
      expect(config.seatRadius).toBeGreaterThan(baseConfig.seatRadius);
      expect(config.seatRadius).toBe(28);
    });

    it('should reduce arc span for small ensembles', () => {
      const config = computeAdaptiveConfig(10, baseConfig);
      expect(config.arcSpanAngle).toBeLessThan(baseConfig.arcSpanAngle);
    });

    it('should use wider row spacing for small ensembles', () => {
      const config = computeAdaptiveConfig(10, baseConfig);
      expect(config.rowSpacing).toBeGreaterThan(baseConfig.rowSpacing);
    });

    it('should set appropriate values for medium ensembles (31-50)', () => {
      const config = computeAdaptiveConfig(40, baseConfig);
      expect(config.seatRadius).toBe(22);
      expect(config.arcSpanAngle).toBe(165);
    });

    it('should use slightly smaller seats for large ensembles (51-80)', () => {
      const config = computeAdaptiveConfig(70, baseConfig);
      expect(config.seatRadius).toBe(20);
    });

    it('should use tighter spacing for very large ensembles (80+)', () => {
      const config = computeAdaptiveConfig(100, baseConfig);
      expect(config.seatRadius).toBe(18);
      expect(config.minSeatSpacing).toBe(8);
      expect(config.arcSpanAngle).toBe(175);
    });

    it('should not modify the original config object', () => {
      const originalRadius = baseConfig.seatRadius;
      computeAdaptiveConfig(10, baseConfig);
      expect(baseConfig.seatRadius).toBe(originalRadius);
    });

    it('should scale progressively', () => {
      const small = computeAdaptiveConfig(10, baseConfig);
      const medium = computeAdaptiveConfig(40, baseConfig);
      const large = computeAdaptiveConfig(100, baseConfig);

      // Seat radius should decrease as ensemble grows
      expect(small.seatRadius).toBeGreaterThan(medium.seatRadius);
      expect(medium.seatRadius).toBeGreaterThan(large.seatRadius);
    });

    it('should dynamically scale stage dimensions', () => {
      const config = computeAdaptiveConfig(46, baseConfig);
      // Stage should be larger than defaults to fit the layout
      expect(config.stageWidth).toBeGreaterThan(1200);
      expect(config.stageHeight).toBeGreaterThan(800);
      // Conductor should be centered horizontally
      expect(config.conductorX).toBe(Math.ceil(config.stageWidth / 2));
      // Conductor should be near bottom
      expect(config.conductorY).toBeGreaterThan(config.stageHeight * 0.8);
    });
  });
});
