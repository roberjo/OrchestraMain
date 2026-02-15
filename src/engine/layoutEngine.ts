import type { Musician } from '@/types/musician.ts';
import type { SeatPosition, LayoutConfig } from '@/types/layout.ts';
import { polarToCartesian, distributeSeatsOnArc, proportionToAngle, arcLength, degToRad } from './arcGeometry.ts';
import { computeAdaptiveConfig } from './spacingCalculator.ts';
import { groupMusiciansByInstrument, applyLayoutOverrides } from './sectionAssigner.ts';

/**
 * Check if a group of musicians can fit on the given arc without overlap.
 * Returns true if the arc has enough length for the seats with minimum spacing.
 */
function canFitOnArc(
  count: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  seatDiameter: number,
  minGap: number,
): boolean {
  if (count <= 0) return true;
  const spanAngle = Math.abs(endAngle - startAngle);
  const length = arcLength(radius, spanAngle);
  const requiredLength = count * (seatDiameter + minGap);
  return length >= requiredLength;
}

/**
 * Main layout computation: takes a roster and config, returns seat positions for all musicians.
 * Ensures no overlapping by checking arc capacity and spilling to adjacent rows when needed.
 */
export function computeLayout(
  musicians: Musician[],
  baseConfig: LayoutConfig,
): Record<string, SeatPosition> {
  if (musicians.length === 0) return {};

  const config = computeAdaptiveConfig(musicians.length, baseConfig);
  const { conductorX, conductorY, innerRadius, rowSpacing, arcSpanAngle, seatRadius, minSeatSpacing } = config;

  // Group and sort musicians
  let groups = groupMusiciansByInstrument(musicians);
  groups = applyLayoutOverrides(groups, config.layoutType);

  const positions: Record<string, SeatPosition> = {};

  // Track how many seats have been placed on each row segment to avoid overlaps
  const rowSeatCounts = new Map<number, number>();

  for (const group of groups) {
    let row = group.defaultArcRow;
    const seatDiameter = seatRadius * 2;

    // Convert normalized angular zone [0..1] to actual radians
    const startAngle = proportionToAngle(group.defaultAngularZone[0], arcSpanAngle);
    const endAngle = proportionToAngle(group.defaultAngularZone[1], arcSpanAngle);

    // Check if the group fits on this arc, if not, try to expand or shift rows
    let radius = innerRadius + row * rowSpacing;
    let attempts = 0;

    while (!canFitOnArc(group.musicians.length, radius, startAngle, endAngle, seatDiameter, minSeatSpacing) && attempts < 3) {
      row += 1;
      radius = innerRadius + row * rowSpacing;
      attempts++;
    }

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

    // Track occupancy
    rowSeatCounts.set(row, (rowSeatCounts.get(row) ?? 0) + group.musicians.length);
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
