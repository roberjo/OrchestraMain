/**
 * Convert polar coordinates (radius, angle) to Cartesian (x, y) relative to conductor point.
 * Convention: angle is in radians where PI = far left, PI/2 = directly behind, 0 = far right.
 * Canvas Y is inverted (increases downward), so we subtract.
 */
export function polarToCartesian(
  conductorX: number,
  conductorY: number,
  radius: number,
  angleRadians: number,
): { x: number; y: number } {
  return {
    x: conductorX + radius * Math.cos(angleRadians),
    y: conductorY - radius * Math.sin(angleRadians),
  };
}

/**
 * Compute arc length for a given radius and span angle.
 */
export function arcLength(radius: number, spanAngleRadians: number): number {
  return radius * spanAngleRadians;
}

/**
 * Compute how many seats can fit on an arc with the given constraints.
 */
export function maxSeatsOnArc(
  radius: number,
  spanAngleRadians: number,
  seatDiameter: number,
  minGap: number,
): number {
  const length = arcLength(radius, spanAngleRadians);
  if (length <= 0) return 0;
  return Math.max(1, Math.floor(length / (seatDiameter + minGap)));
}

/**
 * Distribute N seats evenly across an angular range.
 * Returns array of angles in radians.
 */
export function distributeSeatsOnArc(
  count: number,
  startAngle: number,
  endAngle: number,
): number[] {
  if (count === 0) return [];
  if (count === 1) return [(startAngle + endAngle) / 2];

  const angles: number[] = [];
  const step = (endAngle - startAngle) / (count + 1);
  for (let i = 1; i <= count; i++) {
    angles.push(startAngle + step * i);
  }
  return angles;
}

/**
 * Convert degrees to radians.
 */
export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert a normalized proportion (0..1) to an angle in radians within the arc span.
 * 0.0 = far left (PI), 1.0 = far right (0 or near 0).
 * The arc is a top-half semicircle centered on the conductor.
 */
export function proportionToAngle(proportion: number, arcSpanDegrees: number): number {
  const halfSpan = degToRad(arcSpanDegrees) / 2;
  const centerAngle = Math.PI / 2; // Directly above conductor
  const startAngle = centerAngle + halfSpan; // Left edge
  const endAngle = centerAngle - halfSpan; // Right edge
  return startAngle + proportion * (endAngle - startAngle);
}
