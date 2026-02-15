import type { LayoutConfig } from '@/types/layout.ts';

/**
 * Compute adaptive layout config based on ensemble size.
 * Adjusts seat radius, spacing, and arc span for different ensemble sizes.
 * Uses wider spacing and larger radii to prevent overlap.
 */
export function computeAdaptiveConfig(musicianCount: number, baseConfig: LayoutConfig): LayoutConfig {
  const config = { ...baseConfig };

  if (musicianCount <= 15) {
    config.seatRadius = 22;
    config.arcSpanAngle = 140;
    config.rowSpacing = 100;
    config.innerRadius = 130;
    config.minSeatSpacing = 12;
  } else if (musicianCount <= 30) {
    config.seatRadius = 19;
    config.arcSpanAngle = 155;
    config.rowSpacing = 90;
    config.innerRadius = 140;
    config.minSeatSpacing = 10;
  } else if (musicianCount <= 50) {
    config.seatRadius = 17;
    config.arcSpanAngle = 165;
    config.rowSpacing = 80;
    config.innerRadius = 150;
    config.minSeatSpacing = 10;
  } else if (musicianCount <= 80) {
    config.seatRadius = 15;
    config.rowSpacing = 72;
    config.innerRadius = 155;
    config.arcSpanAngle = 170;
    config.minSeatSpacing = 8;
  } else {
    config.seatRadius = 13;
    config.rowSpacing = 65;
    config.innerRadius = 160;
    config.minSeatSpacing = 7;
    config.arcSpanAngle = 175;
  }

  return config;
}
