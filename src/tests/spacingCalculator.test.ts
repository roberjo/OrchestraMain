import { describe, it, expect } from 'vitest';
import { computeAdaptiveConfig } from '@/engine/spacingCalculator.ts';
import { getDefaultLayoutConfig } from '@/engine/layoutPresets.ts';

describe('spacingCalculator', () => {
  describe('computeAdaptiveConfig', () => {
    const baseConfig = getDefaultLayoutConfig('american-orchestra');

    it('should increase seat radius for small ensembles (<=15)', () => {
      const config = computeAdaptiveConfig(10, baseConfig);
      expect(config.seatRadius).toBeGreaterThan(baseConfig.seatRadius);
      expect(config.seatRadius).toBe(20);
    });

    it('should reduce arc span for small ensembles', () => {
      const config = computeAdaptiveConfig(10, baseConfig);
      expect(config.arcSpanAngle).toBeLessThan(baseConfig.arcSpanAngle);
    });

    it('should use wider row spacing for small ensembles', () => {
      const config = computeAdaptiveConfig(10, baseConfig);
      expect(config.rowSpacing).toBeGreaterThan(baseConfig.rowSpacing);
    });

    it('should keep defaults for medium ensembles (31-50)', () => {
      const config = computeAdaptiveConfig(40, baseConfig);
      expect(config.seatRadius).toBe(baseConfig.seatRadius);
      expect(config.arcSpanAngle).toBe(baseConfig.arcSpanAngle);
    });

    it('should reduce seat radius for large ensembles (51-80)', () => {
      const config = computeAdaptiveConfig(70, baseConfig);
      expect(config.seatRadius).toBeLessThan(baseConfig.seatRadius);
    });

    it('should use tighter spacing for very large ensembles (80+)', () => {
      const config = computeAdaptiveConfig(100, baseConfig);
      expect(config.seatRadius).toBe(11);
      expect(config.minSeatSpacing).toBe(5);
      expect(config.arcSpanAngle).toBe(178);
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
  });
});
