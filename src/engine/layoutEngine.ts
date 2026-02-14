import type { Musician } from '@/types/musician.ts';
import type { SeatPosition, LayoutConfig } from '@/types/layout.ts';
import { polarToCartesian, distributeSeatsOnArc, proportionToAngle } from './arcGeometry.ts';
import { computeAdaptiveConfig } from './spacingCalculator.ts';
import { groupMusiciansByInstrument, applyLayoutOverrides } from './sectionAssigner.ts';

/**
 * Main layout computation: takes a roster and config, returns seat positions for all musicians.
 */
export function computeLayout(
  musicians: Musician[],
  baseConfig: LayoutConfig,
): Record<string, SeatPosition> {
  if (musicians.length === 0) return {};

  const config = computeAdaptiveConfig(musicians.length, baseConfig);
  const { conductorX, conductorY, innerRadius, rowSpacing, arcSpanAngle } = config;

  // Group and sort musicians
  let groups = groupMusiciansByInstrument(musicians);
  groups = applyLayoutOverrides(groups, config.layoutType);

  const positions: Record<string, SeatPosition> = {};

  // Track how many seats have been placed on each row to avoid overlaps
  const rowOccupancy = new Map<number, Array<{ start: number; end: number }>>();

  for (const group of groups) {
    const row = group.defaultArcRow;
    const radius = innerRadius + row * rowSpacing;

    // Convert normalized angular zone [0..1] to actual radians
    const startAngle = proportionToAngle(group.defaultAngularZone[0], arcSpanAngle);
    const endAngle = proportionToAngle(group.defaultAngularZone[1], arcSpanAngle);

    // Distribute this group's musicians evenly within their angular zone
    const angles = distributeSeatsOnArc(group.musicians.length, startAngle, endAngle);

    for (let i = 0; i < group.musicians.length; i++) {
      const musician = group.musicians[i];
      const angle = angles[i];
      const { x, y } = polarToCartesian(conductorX, conductorY, radius, angle);

      positions[musician.id] = {
        musicianId: musician.id,
        x,
        y,
        angle,
        row,
        isManuallyPlaced: false,
      };
    }

    // Track occupancy for this row
    if (!rowOccupancy.has(row)) {
      rowOccupancy.set(row, []);
    }
    rowOccupancy.get(row)!.push({
      start: Math.min(startAngle, endAngle),
      end: Math.max(startAngle, endAngle),
    });
  }

  return positions;
}

/**
 * Recompute layout but preserve manually placed seats.
 */
export function recomputeLayout(
  musicians: Musician[],
  config: LayoutConfig,
  existingPositions: Record<string, SeatPosition>,
): Record<string, SeatPosition> {
  const newPositions = computeLayout(musicians, config);

  // Preserve manually placed seats
  for (const [id, pos] of Object.entries(existingPositions)) {
    if (pos.isManuallyPlaced && newPositions[id]) {
      newPositions[id] = { ...pos };
    }
  }

  return newPositions;
}
