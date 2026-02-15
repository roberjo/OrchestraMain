import type { LayoutConfig } from '@/types/layout.ts';

/**
 * Compute adaptive layout config based on ensemble size.
 * Adjusts seat radius, spacing, and arc span for different ensemble sizes.
 * Seats are large enough to show instrument icons clearly. Stage dimensions
 * scale to accommodate the layout.
 */
export function computeAdaptiveConfig(musicianCount: number, baseConfig: LayoutConfig): LayoutConfig {
  const config = { ...baseConfig };

  if (musicianCount <= 15) {
    config.seatRadius = 28;
    config.arcSpanAngle = 140;
    config.rowSpacing = 110;
    config.innerRadius = 160;
    config.minSeatSpacing = 16;
  } else if (musicianCount <= 30) {
    config.seatRadius = 24;
    config.arcSpanAngle = 155;
    config.rowSpacing = 100;
    config.innerRadius = 170;
    config.minSeatSpacing = 14;
  } else if (musicianCount <= 50) {
    config.seatRadius = 22;
    config.arcSpanAngle = 165;
    config.rowSpacing = 90;
    config.innerRadius = 180;
    config.minSeatSpacing = 12;
  } else if (musicianCount <= 80) {
    config.seatRadius = 20;
    config.rowSpacing = 82;
    config.innerRadius = 190;
    config.arcSpanAngle = 170;
    config.minSeatSpacing = 10;
  } else {
    config.seatRadius = 18;
    config.rowSpacing = 75;
    config.innerRadius = 200;
    config.minSeatSpacing = 8;
    config.arcSpanAngle = 175;
  }

  // Scale stage dimensions to fit the layout
  // Max row is ~6-7, so total depth = innerRadius + 7 * rowSpacing
  const maxRows = 7;
  const totalDepth = config.innerRadius + maxRows * config.rowSpacing;
  const neededWidth = Math.max(1600, totalDepth * 2.2);
  const neededHeight = Math.max(1200, totalDepth + 200);

  config.stageWidth = Math.ceil(neededWidth);
  config.stageHeight = Math.ceil(neededHeight);
  config.conductorX = Math.ceil(neededWidth / 2);
  config.conductorY = Math.ceil(neededHeight - 80);

  return config;
}
