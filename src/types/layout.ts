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
