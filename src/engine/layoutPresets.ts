import type { InstrumentFamily } from '@/types/musician.ts';
import type { LayoutConfig, LayoutType } from '@/types/layout.ts';

export interface SectionArcAssignment {
  family: InstrumentFamily;
  arcRows: number[];
  angularRange: [number, number];
  priority: number;
}

export interface LayoutPreset {
  type: LayoutType;
  displayName: string;
  description: string;
  defaultConfig: Partial<LayoutConfig>;
  sectionArcAssignments: SectionArcAssignment[];
}

export const PRESET_AMERICAN_ORCHESTRA: LayoutPreset = {
  type: 'american-orchestra',
  displayName: 'American Orchestra',
  description: '1st Violins left, 2nd Violins left-center. Violas/Cellos right. Standard US seating.',
  defaultConfig: {
    arcSpanAngle: 170,
    innerRadius: 120,
    rowSpacing: 65,
    seatRadius: 14,
    minSeatSpacing: 8,
  },
  sectionArcAssignments: [
    { family: 'strings',    arcRows: [0, 1, 2], angularRange: [0.0, 1.0],  priority: 1 },
    { family: 'woodwinds',  arcRows: [2, 3],    angularRange: [0.15, 0.75], priority: 2 },
    { family: 'brass',      arcRows: [4, 5],    angularRange: [0.0, 0.90],  priority: 3 },
    { family: 'percussion', arcRows: [5, 6],    angularRange: [0.25, 0.75], priority: 4 },
    { family: 'keyboard',   arcRows: [1, 2],    angularRange: [0.0, 0.10],  priority: 5 },
  ],
};

export const PRESET_GERMAN_ORCHESTRA: LayoutPreset = {
  type: 'german-orchestra',
  displayName: 'German/European Orchestra',
  description: '1st Violins left, 2nd Violins right (antiphonal). Cellos left-center.',
  defaultConfig: {
    arcSpanAngle: 170,
    innerRadius: 120,
    rowSpacing: 65,
    seatRadius: 14,
    minSeatSpacing: 8,
  },
  sectionArcAssignments: [
    { family: 'strings',    arcRows: [0, 1, 2], angularRange: [0.0, 1.0],  priority: 1 },
    { family: 'woodwinds',  arcRows: [2, 3],    angularRange: [0.15, 0.75], priority: 2 },
    { family: 'brass',      arcRows: [4, 5],    angularRange: [0.0, 0.90],  priority: 3 },
    { family: 'percussion', arcRows: [5, 6],    angularRange: [0.25, 0.75], priority: 4 },
    { family: 'keyboard',   arcRows: [1, 2],    angularRange: [0.0, 0.10],  priority: 5 },
  ],
};

export const PRESET_CONCERT_BAND: LayoutPreset = {
  type: 'concert-band',
  displayName: 'Concert Band',
  description: 'No strings. Clarinets front-center. Flutes left. Brass back. Percussion center-back.',
  defaultConfig: {
    arcSpanAngle: 160,
    innerRadius: 100,
    rowSpacing: 60,
    seatRadius: 14,
    minSeatSpacing: 8,
  },
  sectionArcAssignments: [
    { family: 'woodwinds',  arcRows: [0, 1, 2, 3], angularRange: [0.0, 1.0],  priority: 1 },
    { family: 'brass',      arcRows: [3, 4, 5],    angularRange: [0.0, 1.0],  priority: 2 },
    { family: 'percussion', arcRows: [5, 6],        angularRange: [0.25, 0.75], priority: 3 },
    { family: 'keyboard',   arcRows: [0],            angularRange: [0.0, 0.10],  priority: 4 },
  ],
};

export const LAYOUT_PRESETS: Record<LayoutType, LayoutPreset> = {
  'american-orchestra': PRESET_AMERICAN_ORCHESTRA,
  'german-orchestra': PRESET_GERMAN_ORCHESTRA,
  'concert-band': PRESET_CONCERT_BAND,
};

export function getDefaultLayoutConfig(layoutType: LayoutType): LayoutConfig {
  const preset = LAYOUT_PRESETS[layoutType];
  return {
    layoutType,
    stageWidth: 1200,
    stageHeight: 800,
    conductorX: 600,
    conductorY: 700,
    innerRadius: preset.defaultConfig.innerRadius ?? 120,
    rowSpacing: preset.defaultConfig.rowSpacing ?? 65,
    seatRadius: preset.defaultConfig.seatRadius ?? 14,
    arcSpanAngle: preset.defaultConfig.arcSpanAngle ?? 170,
    minSeatSpacing: preset.defaultConfig.minSeatSpacing ?? 8,
  };
}
