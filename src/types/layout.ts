export interface SeatPosition {
  musicianId: string;
  x: number;
  y: number;
  angle: number;
  row: number;
  isManuallyPlaced: boolean;
}

export interface ArcRow {
  rowIndex: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  seatCount: number;
}

export interface LayoutConfig {
  layoutType: LayoutType;
  stageWidth: number;
  stageHeight: number;
  conductorX: number;
  conductorY: number;
  innerRadius: number;
  rowSpacing: number;
  seatRadius: number;
  arcSpanAngle: number;
  minSeatSpacing: number;
}

export type LayoutType = 'american-orchestra' | 'german-orchestra' | 'concert-band';

/**
 * A Wedge groups multiple seats (musicians) that move together as a unit.
 * Sections auto-generate wedges by default. Users can also create custom ones.
 */
export interface Wedge {
  id: string;
  name: string;
  seatIds: string[]; // musician IDs belonging to this wedge
  color: string;     // border/highlight color
  locked: boolean;   // if true, seats cannot be individually dragged out
}
