import type { Musician } from './musician.ts';

export interface ColumnMapping {
  nameColumn: string | null;
  instrumentColumn: string | null;
  chairColumn: string | null;
  sectionColumn: string | null;
}

export interface ImportResult {
  musicians: Musician[];
  warnings: string[];
  errors: string[];
  unmappedInstruments: string[];
}
