import type { Musician } from '@/types/musician.ts';
import type { SeatPosition, LayoutConfig } from '@/types/layout.ts';
import { polarToCartesian, proportionToAngle, maxSeatsOnArc } from './arcGeometry.ts';
import { computeAdaptiveConfig } from './spacingCalculator.ts';
import { groupMusiciansByInstrument, applyLayoutOverrides } from './sectionAssigner.ts';

interface OccupiedSpan {
  start: number;
  end: number;
}

/**
 * Check if a given angular range overlaps with any occupied spans on the row.
 */
function isOverlapping(
  startAngle: number,
  endAngle: number,
  occupied: OccupiedSpan[]
): boolean {
  // Normalize angles if needed? 
  // proportionToAngle: 0 -> Left (bigger angle), 1 -> Right (smaller angle).
  // So startAngle > endAngle usually.

  const minA = Math.min(startAngle, endAngle);
  const maxA = Math.max(startAngle, endAngle);

  for (const span of occupied) {
    const sMin = Math.min(span.start, span.end);
    const sMax = Math.max(span.start, span.end);

    // Check intersection
    if (minA < sMax && maxA > sMin) {
      return true;
    }
  }
  return false;
}

/**
 * Main layout computation: takes a roster and config, returns seat positions for all musicians.
 * Uses a spillover algorithm: fills the default row first, then spills to subsequent rows,
 * checking for collisions with already placed sections.
 */
export function computeLayout(
  musicians: Musician[],
  baseConfig: LayoutConfig,
): Record<string, SeatPosition> {
  if (musicians.length === 0) return {};

  const config = computeAdaptiveConfig(musicians.length, baseConfig);
  const { conductorX, conductorY, innerRadius, rowSpacing, arcSpanAngle, seatRadius, minSeatSpacing } = config;
  const seatDiameter = seatRadius * 2;

  // Group and sort musicians
  let groups = groupMusiciansByInstrument(musicians);
  groups = applyLayoutOverrides(groups, config.layoutType);

  const positions: Record<string, SeatPosition> = {};

  // Track occupied angular zones per row to prevent collisions
  const rowOccupancy = new Map<number, OccupiedSpan[]>();

  for (const group of groups) {
    let musiciansToPlace = [...group.musicians];
    let currentRow = group.defaultArcRow;
    let attempts = 0;
    const maxAttempts = 10; // Prevent infinite loops

    while (musiciansToPlace.length > 0 && attempts < maxAttempts) {
      if (!rowOccupancy.has(currentRow)) {
        rowOccupancy.set(currentRow, []);
      }
      const occupied = rowOccupancy.get(currentRow)!;

      // Calculate the target angular zone for this row
      const zoneStart = proportionToAngle(group.defaultAngularZone[0], arcSpanAngle);
      const zoneEnd = proportionToAngle(group.defaultAngularZone[1], arcSpanAngle);

      const currentRadius = innerRadius + currentRow * rowSpacing;

      // Check collision with existing groups on this row
      if (isOverlapping(zoneStart, zoneEnd, occupied)) {
        // If overlap, skip this row entirely for this group (simple collision resolution)
        currentRow++;
        attempts++;
        continue;
      }

      // Calculate capacity of this zone
      // capacity = maxSeatsOnArc
      // The capacity should be based strictly on the geometric length available in the zone
      const zoneSpanAngle = Math.abs(zoneEnd - zoneStart);
      const capacity = maxSeatsOnArc(currentRadius, zoneSpanAngle, seatDiameter, minSeatSpacing);

      // If zone is too small to fit even one seat (unlikely but possible), skip row
      if (capacity <= 0) {
        currentRow++;
        attempts++;
        continue;
      }

      // Determine how many we can place
      const countToPlace = Math.min(musiciansToPlace.length, capacity);

      if (countToPlace > 0) {
        // Calculate the actual angular span needed for these seats
        // We center them within the available zone
        const totalSeatArcLength = countToPlace * (seatDiameter + minSeatSpacing) - minSeatSpacing; // Remove last gap
        const totalSpanAngle = totalSeatArcLength / currentRadius;

        // Center the span
        const zoneCenter = (zoneStart + zoneEnd) / 2;
        const actualStart = zoneCenter + totalSpanAngle / 2; // Start from left (larger angle)
        const actualEnd = zoneCenter - totalSpanAngle / 2;   // End at right (smaller angle)

        // Generate positions
        // Distribute uniformly
        const step = countToPlace > 1 ? totalSpanAngle / (countToPlace - 1) : 0;

        for (let i = 0; i < countToPlace; i++) {
          let angle: number;
          if (countToPlace === 1) {
            angle = (actualStart + actualEnd) / 2;
          } else {
            // angle from actualStart decreasing to actualEnd (assuming start is left/larger)
            angle = actualStart - (i * step);
          }

          const musician = musiciansToPlace[i];
          const { x, y } = polarToCartesian(conductorX, conductorY, currentRadius, angle);
          positions[musician.id] = {
            musicianId: musician.id,
            x, y, angle, row: currentRow, isManuallyPlaced: false
          };
        }

        // Mark this span as occupied
        occupied.push({ start: actualStart, end: actualEnd });

        // Remove placed musicians
        musiciansToPlace.splice(0, countToPlace);
      }

      // Move to next row for remaining musicians
      currentRow++;
      attempts++;
    }
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
    } else if (pos.isManuallyPlaced && !newPositions[id]) {
      const musicianExists = musicians.find(m => m.id === id);
      if (musicianExists) {
        newPositions[id] = { ...pos };
      }
    }
  }

  return newPositions;
}
