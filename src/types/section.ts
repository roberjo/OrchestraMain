import type { InstrumentFamily } from './musician.ts';

export interface SectionConfig {
  family: InstrumentFamily;
  displayName: string;
  color: string;
  arcRows: number[];
  angularRange: [number, number];
  zIndex: number;
}
