export type InstrumentFamily = 'strings' | 'woodwinds' | 'brass' | 'percussion' | 'keyboard' | 'other';

export interface Instrument {
  id: string;
  name: string;
  family: InstrumentFamily;
  defaultArcRow: number;
  defaultAngularZone: [number, number];
  sortOrder: number;
}

export interface Musician {
  id: string;
  name: string;
  instrument: string;
  chair: number | null;
  section: InstrumentFamily;
  customLabel?: string;
}
