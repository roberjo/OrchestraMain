import type { Musician } from './musician.ts';
import type { SeatPosition, LayoutConfig, LayoutType } from './layout.ts';

export interface Project {
  id: string;
  name: string;
  layoutType: LayoutType;
  layoutConfig: LayoutConfig;
  musicians: Musician[];
  seatPositions: SeatPosition[];
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface ProjectMetadata {
  id: string;
  name: string;
  layoutType: LayoutType;
  musicianCount: number;
  updatedAt: string;
}
