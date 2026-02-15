import type { Instrument } from '@/types/musician.ts';

export const INSTRUMENTS: Record<string, Instrument> = {
  // === STRINGS (Arc rows 0-1, front) ===
  'violin-1':       { id: 'violin-1',       name: '1st Violin',     family: 'strings',    defaultArcRow: 0, defaultAngularZone: [0.0, 0.30],  sortOrder: 1 },
  'violin-2':       { id: 'violin-2',       name: '2nd Violin',     family: 'strings',    defaultArcRow: 0, defaultAngularZone: [0.30, 0.50],  sortOrder: 2 },
  'viola':          { id: 'viola',           name: 'Viola',          family: 'strings',    defaultArcRow: 1, defaultAngularZone: [0.50, 0.70],  sortOrder: 3 },
  'cello':          { id: 'cello',           name: 'Cello',          family: 'strings',    defaultArcRow: 1, defaultAngularZone: [0.70, 0.90],  sortOrder: 4 },
  'double-bass':    { id: 'double-bass',     name: 'Double Bass',    family: 'strings',    defaultArcRow: 2, defaultAngularZone: [0.85, 1.0],   sortOrder: 5 },
  'harp':           { id: 'harp',            name: 'Harp',           family: 'strings',    defaultArcRow: 1, defaultAngularZone: [0.0, 0.08],   sortOrder: 6 },

  // === WOODWINDS (Arc rows 2-3, middle) ===
  'flute':          { id: 'flute',           name: 'Flute',          family: 'woodwinds',  defaultArcRow: 2, defaultAngularZone: [0.20, 0.40],  sortOrder: 1 },
  'piccolo':        { id: 'piccolo',         name: 'Piccolo',        family: 'woodwinds',  defaultArcRow: 2, defaultAngularZone: [0.20, 0.35],  sortOrder: 2 },
  'oboe':           { id: 'oboe',            name: 'Oboe',           family: 'woodwinds',  defaultArcRow: 2, defaultAngularZone: [0.40, 0.55],  sortOrder: 3 },
  'english-horn':   { id: 'english-horn',    name: 'English Horn',   family: 'woodwinds',  defaultArcRow: 2, defaultAngularZone: [0.45, 0.55],  sortOrder: 4 },
  'clarinet':       { id: 'clarinet',        name: 'Clarinet',       family: 'woodwinds',  defaultArcRow: 3, defaultAngularZone: [0.20, 0.40],  sortOrder: 5 },
  'bass-clarinet':  { id: 'bass-clarinet',   name: 'Bass Clarinet',  family: 'woodwinds',  defaultArcRow: 3, defaultAngularZone: [0.20, 0.35],  sortOrder: 6 },
  'bassoon':        { id: 'bassoon',         name: 'Bassoon',        family: 'woodwinds',  defaultArcRow: 3, defaultAngularZone: [0.55, 0.70],  sortOrder: 7 },
  'contrabassoon':  { id: 'contrabassoon',   name: 'Contrabassoon',  family: 'woodwinds',  defaultArcRow: 3, defaultAngularZone: [0.60, 0.70],  sortOrder: 8 },
  'saxophone':      { id: 'saxophone',       name: 'Saxophone',      family: 'woodwinds',  defaultArcRow: 3, defaultAngularZone: [0.40, 0.55],  sortOrder: 9 },

  // === BRASS (Arc rows 4-5, back) ===
  'french-horn':    { id: 'french-horn',     name: 'French Horn',    family: 'brass',      defaultArcRow: 4, defaultAngularZone: [0.0, 0.25],   sortOrder: 1 },
  'trumpet':        { id: 'trumpet',         name: 'Trumpet',        family: 'brass',      defaultArcRow: 4, defaultAngularZone: [0.25, 0.50],  sortOrder: 2 },
  'cornet':         { id: 'cornet',          name: 'Cornet',         family: 'brass',      defaultArcRow: 4, defaultAngularZone: [0.25, 0.50],  sortOrder: 3 },
  'trombone':       { id: 'trombone',        name: 'Trombone',       family: 'brass',      defaultArcRow: 5, defaultAngularZone: [0.50, 0.75],  sortOrder: 4 },
  'bass-trombone':  { id: 'bass-trombone',   name: 'Bass Trombone',  family: 'brass',      defaultArcRow: 5, defaultAngularZone: [0.60, 0.75],  sortOrder: 5 },
  'tuba':           { id: 'tuba',            name: 'Tuba',           family: 'brass',      defaultArcRow: 5, defaultAngularZone: [0.75, 0.90],  sortOrder: 6 },
  'euphonium':      { id: 'euphonium',       name: 'Euphonium',      family: 'brass',      defaultArcRow: 5, defaultAngularZone: [0.70, 0.85],  sortOrder: 7 },

  // === PERCUSSION (Arc rows 5-6, center-back) ===
  'timpani':        { id: 'timpani',         name: 'Timpani',        family: 'percussion', defaultArcRow: 5, defaultAngularZone: [0.35, 0.55],  sortOrder: 1 },
  'snare-drum':     { id: 'snare-drum',      name: 'Snare Drum',     family: 'percussion', defaultArcRow: 6, defaultAngularZone: [0.30, 0.45],  sortOrder: 2 },
  'bass-drum':      { id: 'bass-drum',       name: 'Bass Drum',      family: 'percussion', defaultArcRow: 6, defaultAngularZone: [0.45, 0.55],  sortOrder: 3 },
  'cymbals':        { id: 'cymbals',         name: 'Cymbals',        family: 'percussion', defaultArcRow: 6, defaultAngularZone: [0.55, 0.65],  sortOrder: 4 },
  'xylophone':      { id: 'xylophone',       name: 'Xylophone',      family: 'percussion', defaultArcRow: 6, defaultAngularZone: [0.25, 0.40],  sortOrder: 5 },
  'marimba':        { id: 'marimba',         name: 'Marimba',        family: 'percussion', defaultArcRow: 6, defaultAngularZone: [0.60, 0.75],  sortOrder: 6 },
  'glockenspiel':   { id: 'glockenspiel',    name: 'Glockenspiel',   family: 'percussion', defaultArcRow: 6, defaultAngularZone: [0.35, 0.50],  sortOrder: 7 },
  'chimes':         { id: 'chimes',          name: 'Chimes',         family: 'percussion', defaultArcRow: 6, defaultAngularZone: [0.50, 0.65],  sortOrder: 8 },
  'percussion':     { id: 'percussion',      name: 'Percussion',     family: 'percussion', defaultArcRow: 6, defaultAngularZone: [0.30, 0.70],  sortOrder: 9 },

  // === KEYBOARD ===
  'piano':          { id: 'piano',           name: 'Piano',          family: 'keyboard',   defaultArcRow: 1, defaultAngularZone: [0.0, 0.10],   sortOrder: 1 },
  'celeste':        { id: 'celeste',         name: 'Celeste',        family: 'keyboard',   defaultArcRow: 2, defaultAngularZone: [0.0, 0.10],   sortOrder: 2 },
  'organ':          { id: 'organ',           name: 'Organ',          family: 'keyboard',   defaultArcRow: 6, defaultAngularZone: [0.90, 1.0],   sortOrder: 3 },
};

/** Fuzzy-matching map: lowercase variants -> canonical instrument id */
export const INSTRUMENT_ALIASES: Record<string, string> = {
  // Violin 1
  '1st violin': 'violin-1', 'first violin': 'violin-1', 'violin 1': 'violin-1',
  'vln 1': 'violin-1', 'vln i': 'violin-1', 'violin i': 'violin-1', '1st vln': 'violin-1',
  'vn1': 'violin-1', 'vn 1': 'violin-1',
  // Violin 2
  '2nd violin': 'violin-2', 'second violin': 'violin-2', 'violin 2': 'violin-2',
  'vln 2': 'violin-2', 'vln ii': 'violin-2', 'violin ii': 'violin-2', '2nd vln': 'violin-2',
  'vn2': 'violin-2', 'vn 2': 'violin-2',
  // Viola
  'viola': 'viola', 'vla': 'viola', 'va': 'viola', 'violas': 'viola',
  // Cello
  'cello': 'cello', 'vc': 'cello', 'vlc': 'cello', 'violoncello': 'cello', 'cellos': 'cello',
  // Double Bass
  'double bass': 'double-bass', 'cb': 'double-bass', 'db': 'double-bass',
  'bass': 'double-bass', 'contrabass': 'double-bass', 'string bass': 'double-bass',
  'double basses': 'double-bass', 'basses': 'double-bass',
  // Harp
  'harp': 'harp', 'hp': 'harp', 'harps': 'harp',
  // Flute
  'flute': 'flute', 'fl': 'flute', 'flt': 'flute', 'flutes': 'flute',
  // Piccolo
  'piccolo': 'piccolo', 'picc': 'piccolo',
  // Oboe
  'oboe': 'oboe', 'ob': 'oboe', 'oboes': 'oboe',
  // English Horn
  'english horn': 'english-horn', 'eh': 'english-horn', 'cor anglais': 'english-horn',
  // Clarinet
  'clarinet': 'clarinet', 'cl': 'clarinet', 'clar': 'clarinet', 'clarinets': 'clarinet',
  // Bass Clarinet
  'bass clarinet': 'bass-clarinet', 'bcl': 'bass-clarinet', 'b. cl.': 'bass-clarinet',
  'b cl': 'bass-clarinet',
  // Bassoon
  'bassoon': 'bassoon', 'bn': 'bassoon', 'bsn': 'bassoon',
  'fg': 'bassoon', 'fagott': 'bassoon', 'bassoons': 'bassoon',
  // Contrabassoon
  'contrabassoon': 'contrabassoon', 'cbn': 'contrabassoon', 'cbsn': 'contrabassoon',
  'contra bassoon': 'contrabassoon',
  // Saxophone
  'saxophone': 'saxophone', 'sax': 'saxophone', 'alto sax': 'saxophone',
  'tenor sax': 'saxophone', 'bari sax': 'saxophone', 'saxophones': 'saxophone',
  'alto saxophone': 'saxophone', 'tenor saxophone': 'saxophone',
  // French Horn
  'french horn': 'french-horn', 'hn': 'french-horn', 'horn': 'french-horn',
  'hr': 'french-horn', 'horns': 'french-horn', 'french horns': 'french-horn',
  // Trumpet
  'trumpet': 'trumpet', 'tpt': 'trumpet', 'tr': 'trumpet', 'tp': 'trumpet',
  'trumpets': 'trumpet',
  // Cornet
  'cornet': 'cornet', 'cor': 'cornet', 'cornets': 'cornet',
  // Trombone
  'trombone': 'trombone', 'tbn': 'trombone', 'trb': 'trombone', 'trombones': 'trombone',
  // Bass Trombone
  'bass trombone': 'bass-trombone', 'btbn': 'bass-trombone', 'b. tbn': 'bass-trombone',
  'b tbn': 'bass-trombone',
  // Tuba
  'tuba': 'tuba', 'tb': 'tuba', 'tba': 'tuba', 'tubas': 'tuba',
  // Euphonium
  'euphonium': 'euphonium', 'euph': 'euphonium', 'baritone': 'euphonium',
  'baritone horn': 'euphonium', 'euphoniums': 'euphonium',
  // Timpani
  'timpani': 'timpani', 'timp': 'timpani', 'kettle drums': 'timpani', 'kettledrums': 'timpani',
  // Snare Drum
  'snare drum': 'snare-drum', 'sd': 'snare-drum', 'snare': 'snare-drum',
  // Bass Drum
  'bass drum': 'bass-drum', 'bd': 'bass-drum',
  // Cymbals
  'cymbals': 'cymbals', 'cym': 'cymbals', 'crash': 'cymbals', 'crash cymbals': 'cymbals',
  // Xylophone
  'xylophone': 'xylophone', 'xyl': 'xylophone',
  // Marimba
  'marimba': 'marimba', 'mar': 'marimba',
  // Glockenspiel
  'glockenspiel': 'glockenspiel', 'glock': 'glockenspiel', 'bells': 'glockenspiel',
  'orchestra bells': 'glockenspiel',
  // Chimes
  'chimes': 'chimes', 'tub bells': 'chimes', 'tubular bells': 'chimes',
  // Generic Percussion
  'percussion': 'percussion', 'perc': 'percussion', 'aux perc': 'percussion',
  'auxiliary percussion': 'percussion', 'mallet percussion': 'percussion',
  // Piano
  'piano': 'piano', 'pno': 'piano', 'pf': 'piano',
  // Celeste
  'celeste': 'celeste', 'cel': 'celeste', 'celesta': 'celeste',
  // Organ
  'organ': 'organ', 'org': 'organ',
};

/**
 * Resolve an instrument string from a CSV/user input to a canonical instrument ID.
 * Returns the instrument ID or null if not found.
 */
export function resolveInstrument(input: string): string | null {
  const normalized = input.trim().toLowerCase();

  // Empty input is not a valid instrument
  if (normalized.length === 0) return null;

  // Direct match on instrument ID
  if (INSTRUMENTS[normalized]) return normalized;

  // Alias match
  if (INSTRUMENT_ALIASES[normalized]) return INSTRUMENT_ALIASES[normalized];

  // Partial match: check if any alias is contained in the input or vice versa
  for (const [alias, id] of Object.entries(INSTRUMENT_ALIASES)) {
    if (normalized.includes(alias) || alias.includes(normalized)) {
      return id;
    }
  }

  return null;
}

/**
 * Get all instrument names for dropdown display, grouped by family.
 */
export function getInstrumentOptions(): Array<{ id: string; name: string; family: string }> {
  return Object.values(INSTRUMENTS)
    .sort((a, b) => {
      const familyOrder = ['strings', 'woodwinds', 'brass', 'percussion', 'keyboard', 'other'];
      const familyDiff = familyOrder.indexOf(a.family) - familyOrder.indexOf(b.family);
      if (familyDiff !== 0) return familyDiff;
      return a.sortOrder - b.sortOrder;
    })
    .map(i => ({ id: i.id, name: i.name, family: i.family }));
}
