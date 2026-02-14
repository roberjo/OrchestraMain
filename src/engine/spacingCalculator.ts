import type { LayoutConfig } from '@/types/layout.ts';

/**
 * Compute adaptive layout config based on ensemble size.
 * Adjusts seat radius, spacing, and arc span for different ensemble sizes.
 */
export function computeAdaptiveConfig(musicianCount: number, baseConfig: LayoutConfig): LayoutConfig {
  const config = { ...baseConfig };

  if (musicianCount <= 15) {
    config.seatRadius = 20;
    config.arcSpanAngle = 130;
    config.rowSpacing = 85;
    config.innerRadius = 100;
  } else if (musicianCount <= 30) {
    config.seatRadius = 17;
    config.arcSpanAngle = 150;
    config.rowSpacing = 75;
    config.innerRadius = 110;
  } else if (musicianCount <= 50) {
    // Use defaults from preset
  } else if (musicianCount <= 80) {
    config.seatRadius = 13;
    config.rowSpacing = 58;
    config.arcSpanAngle = 175;
  } else {
    config.seatRadius = 11;
    config.rowSpacing = 52;
    config.minSeatSpacing = 5;
    config.arcSpanAngle = 178;
  }

  return config;
}
