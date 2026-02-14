import type { Musician, InstrumentFamily } from '@/types/musician.ts';
import type { LayoutType } from '@/types/layout.ts';
import { INSTRUMENTS } from './instrumentTaxonomy.ts';

export interface InstrumentGroup {
  instrumentId: string;
  family: InstrumentFamily;
  musicians: Musician[];
  defaultArcRow: number;
  defaultAngularZone: [number, number];
  sortOrder: number;
}

/**
 * Group musicians by instrument, sorted by section priority then instrument sort order.
 */
export function groupMusiciansByInstrument(musicians: Musician[]): InstrumentGroup[] {
  const groups = new Map<string, InstrumentGroup>();

  for (const m of musicians) {
    const instrument = INSTRUMENTS[m.instrument];
    if (!instrument) continue;

    if (!groups.has(m.instrument)) {
      groups.set(m.instrument, {
        instrumentId: m.instrument,
        family: instrument.family,
        musicians: [],
        defaultArcRow: instrument.defaultArcRow,
        defaultAngularZone: [...instrument.defaultAngularZone],
        sortOrder: instrument.sortOrder,
      });
    }
    groups.get(m.instrument)!.musicians.push(m);
  }

  // Sort musicians within each group by chair number
  for (const group of groups.values()) {
    group.musicians.sort((a, b) => {
      const aChair = a.chair ?? 999;
      const bChair = b.chair ?? 999;
      return aChair - bChair;
    });
  }

  const familyOrder: InstrumentFamily[] = ['strings', 'woodwinds', 'brass', 'percussion', 'keyboard', 'other'];

  return Array.from(groups.values()).sort((a, b) => {
    const familyDiff = familyOrder.indexOf(a.family) - familyOrder.indexOf(b.family);
    if (familyDiff !== 0) return familyDiff;
    return a.sortOrder - b.sortOrder;
  });
}

/**
 * For the German layout, swap 2nd violins to the right side.
 */
export function applyGermanOverrides(groups: InstrumentGroup[]): InstrumentGroup[] {
  return groups.map((g) => {
    if (g.instrumentId === 'violin-2') {
      return { ...g, defaultAngularZone: [0.70, 0.95] as [number, number] };
    }
    if (g.instrumentId === 'cello') {
      return { ...g, defaultAngularZone: [0.30, 0.50] as [number, number] };
    }
    if (g.instrumentId === 'viola') {
      return { ...g, defaultAngularZone: [0.50, 0.70] as [number, number] };
    }
    return g;
  });
}

/**
 * Apply layout-specific overrides to instrument groups.
 */
export function applyLayoutOverrides(
  groups: InstrumentGroup[],
  _layoutType: LayoutType,
): InstrumentGroup[] {
  if (_layoutType === 'german-orchestra') {
    return applyGermanOverrides(groups);
  }
  return groups;
}
