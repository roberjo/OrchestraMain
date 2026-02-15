import Konva from 'konva';
import type { Wedge, SeatPosition } from '@/types/layout.ts';

/**
 * Compute the convex hull of a set of 2D points using the Graham scan algorithm.
 * Returns points in counter-clockwise order.
 */
function convexHull(points: { x: number; y: number }[]): { x: number; y: number }[] {
  if (points.length <= 2) return [...points];

  // Find the bottom-most point (largest y, then smallest x)
  let pivot = points[0];
  for (const p of points) {
    if (p.y > pivot.y || (p.y === pivot.y && p.x < pivot.x)) {
      pivot = p;
    }
  }

  // Sort by polar angle with respect to pivot
  const sorted = points
    .filter((p) => p !== pivot)
    .sort((a, b) => {
      const angleA = Math.atan2(pivot.y - a.y, a.x - pivot.x);
      const angleB = Math.atan2(pivot.y - b.y, b.x - pivot.x);
      if (Math.abs(angleA - angleB) < 1e-10) {
        // Same angle: closer point first
        const distA = (a.x - pivot.x) ** 2 + (a.y - pivot.y) ** 2;
        const distB = (b.x - pivot.x) ** 2 + (b.y - pivot.y) ** 2;
        return distA - distB;
      }
      return angleA - angleB;
    });

  const stack: { x: number; y: number }[] = [pivot];
  for (const p of sorted) {
    while (stack.length > 1) {
      const top = stack[stack.length - 1];
      const below = stack[stack.length - 2];
      const cross = (top.x - below.x) * (p.y - below.y) - (top.y - below.y) * (p.x - below.x);
      if (cross <= 0) {
        stack.pop();
      } else {
        break;
      }
    }
    stack.push(p);
  }

  return stack;
}

/**
 * Draw wedge boundaries on the canvas layer.
 * Each wedge is rendered as a rounded convex hull outline around its seats.
 */
export function drawWedgeBoundaries(
  layer: Konva.Layer,
  wedges: Wedge[],
  positions: Record<string, SeatPosition>,
  seatRadius: number,
  selectedWedgeId: string | null,
  onSelectWedge: (wedgeId: string) => void,
) {
  const padding = seatRadius + 10; // Extra padding around seats

  for (const wedge of wedges) {
    // Collect seat positions for this wedge
    const seatPoints: { x: number; y: number }[] = [];
    for (const seatId of wedge.seatIds) {
      const pos = positions[seatId];
      if (pos) {
        seatPoints.push({ x: pos.x, y: pos.y });
      }
    }

    if (seatPoints.length === 0) continue;

    const isSelected = wedge.id === selectedWedgeId;

    if (seatPoints.length === 1) {
      // Single seat: draw a circle
      const p = seatPoints[0];
      const circle = new Konva.Circle({
        x: p.x,
        y: p.y,
        radius: padding,
        stroke: wedge.color,
        strokeWidth: isSelected ? 3 : 2,
        dash: isSelected ? undefined : [8, 4],
        opacity: isSelected ? 0.8 : 0.5,
        fill: wedge.color,
        fillEnabled: true,
        // Very transparent fill
        listening: true,
      });
      circle.opacity(isSelected ? 0.15 : 0.08);

      // Separate stroke circle on top for visibility
      const strokeCircle = new Konva.Circle({
        x: p.x,
        y: p.y,
        radius: padding,
        stroke: wedge.color,
        strokeWidth: isSelected ? 3 : 2,
        dash: isSelected ? undefined : [8, 4],
        opacity: isSelected ? 0.8 : 0.5,
        listening: true,
      });

      strokeCircle.on('click', (e) => {
        e.cancelBubble = true;
        onSelectWedge(wedge.id);
      });

      layer.add(circle);
      layer.add(strokeCircle);
      continue;
    }

    // Compute convex hull
    const hull = convexHull(seatPoints);
    if (hull.length < 2) continue;

    // Expand the hull outward by padding amount
    const expandedHull = expandHull(hull, padding);

    // Convert to flat array for Konva.Line
    const flatPoints: number[] = [];
    for (const p of expandedHull) {
      flatPoints.push(p.x, p.y);
    }

    // Draw filled background (very transparent)
    const fillShape = new Konva.Line({
      points: flatPoints,
      closed: true,
      fill: wedge.color,
      opacity: isSelected ? 0.12 : 0.06,
      listening: true,
    });

    fillShape.on('click', (e) => {
      e.cancelBubble = true;
      onSelectWedge(wedge.id);
    });

    layer.add(fillShape);

    // Draw border
    const border = new Konva.Line({
      points: flatPoints,
      closed: true,
      stroke: wedge.color,
      strokeWidth: isSelected ? 3 : 2,
      dash: isSelected ? undefined : [8, 4],
      opacity: isSelected ? 0.7 : 0.4,
      tension: 0.3, // Smooth corners
      listening: false,
    });

    layer.add(border);

    // Wedge label
    const centroid = getCentroid(expandedHull);
    const minY = Math.min(...expandedHull.map((p) => p.y));

    const label = new Konva.Text({
      x: centroid.x,
      y: minY - 18,
      text: wedge.name,
      fontSize: 11,
      fontFamily: 'Inter, Arial, sans-serif',
      fontStyle: 'bold',
      fill: wedge.color,
      opacity: isSelected ? 0.9 : 0.6,
      listening: false,
    });
    // Center the label
    label.offsetX(label.width() / 2);

    layer.add(label);
  }
}

/**
 * Expand a convex hull outward by a given distance.
 */
function expandHull(
  hull: { x: number; y: number }[],
  distance: number,
): { x: number; y: number }[] {
  const centroid = getCentroid(hull);
  return hull.map((p) => {
    const dx = p.x - centroid.x;
    const dy = p.y - centroid.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return { x: p.x + distance, y: p.y };
    return {
      x: p.x + (dx / len) * distance,
      y: p.y + (dy / len) * distance,
    };
  });
}

/**
 * Get the centroid of a polygon.
 */
function getCentroid(points: { x: number; y: number }[]): { x: number; y: number } {
  let cx = 0;
  let cy = 0;
  for (const p of points) {
    cx += p.x;
    cy += p.y;
  }
  return { x: cx / points.length, y: cy / points.length };
}
