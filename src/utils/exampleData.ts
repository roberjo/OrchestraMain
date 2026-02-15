import { generateId } from './idGenerator.ts';
import type { Musician } from '@/types/musician.ts';

export interface ExampleOrchestraConfig {
  name: string;
  description: string;
  musicians: Musician[];
}

export const EXAMPLE_AMERICAN_ORCHESTRA: ExampleOrchestraConfig = {
  name: 'American Symphony Orchestra',
  description: 'Standard 60-member American orchestra configuration',
  musicians: [
    // Concertmaster
    { id: generateId('mus'), name: 'Concertmaster', instrument: 'violin-1', chair: 1, section: 'strings' },
    // Violin I (8 total)
    ...Array.from({ length: 7 }, (_, i) => ({
      id: generateId('mus'),
      name: `Violin I - Position ${i + 2}`,
      instrument: 'violin-1',
      chair: i + 2,
      section: 'strings' as const,
    })),
    // Violin II (6 total)
    ...Array.from({ length: 6 }, (_, i) => ({
      id: generateId('mus'),
      name: `Violin II - Position ${i + 1}`,
      instrument: 'violin-2',
      chair: i + 1,
      section: 'strings' as const,
    })),
    // Viola (4 total)
    ...Array.from({ length: 4 }, (_, i) => ({
      id: generateId('mus'),
      name: `Viola - Position ${i + 1}`,
      instrument: 'viola',
      chair: i + 1,
      section: 'strings' as const,
    })),
    // Cello (3 total)
    ...Array.from({ length: 3 }, (_, i) => ({
      id: generateId('mus'),
      name: `Cello - Position ${i + 1}`,
      instrument: 'cello',
      chair: i + 1,
      section: 'strings' as const,
    })),
    // Double Bass (2 total)
    ...Array.from({ length: 2 }, (_, i) => ({
      id: generateId('mus'),
      name: `Double Bass - Position ${i + 1}`,
      instrument: 'double-bass',
      chair: i + 1,
      section: 'strings' as const,
    })),
    // Flute (2 total)
    ...Array.from({ length: 2 }, (_, i) => ({
      id: generateId('mus'),
      name: `Flute - Position ${i + 1}`,
      instrument: 'flute',
      chair: i + 1,
      section: 'woodwinds' as const,
    })),
    // Oboe (2 total)
    ...Array.from({ length: 2 }, (_, i) => ({
      id: generateId('mus'),
      name: `Oboe - Position ${i + 1}`,
      instrument: 'oboe',
      chair: i + 1,
      section: 'woodwinds' as const,
    })),
    // Clarinet (2 total)
    ...Array.from({ length: 2 }, (_, i) => ({
      id: generateId('mus'),
      name: `Clarinet - Position ${i + 1}`,
      instrument: 'clarinet',
      chair: i + 1,
      section: 'woodwinds' as const,
    })),
    // Bassoon (2 total)
    ...Array.from({ length: 2 }, (_, i) => ({
      id: generateId('mus'),
      name: `Bassoon - Position ${i + 1}`,
      instrument: 'bassoon',
      chair: i + 1,
      section: 'woodwinds' as const,
    })),
    // French Horn (4 total)
    ...Array.from({ length: 4 }, (_, i) => ({
      id: generateId('mus'),
      name: `French Horn - Position ${i + 1}`,
      instrument: 'french-horn',
      chair: i + 1,
      section: 'brass' as const,
    })),
    // Trumpet (3 total)
    ...Array.from({ length: 3 }, (_, i) => ({
      id: generateId('mus'),
      name: `Trumpet - Position ${i + 1}`,
      instrument: 'trumpet',
      chair: i + 1,
      section: 'brass' as const,
    })),
    // Trombone (3 total, 2 tenor + 1 bass)
    ...Array.from({ length: 3 }, (_, i) => ({
      id: generateId('mus'),
      name: `Trombone - Position ${i + 1}`,
      instrument: 'trombone',
      chair: i + 1,
      section: 'brass' as const,
    })),
    // Tuba (1 total)
    { id: generateId('mus'), name: 'Tuba', instrument: 'tuba', chair: 1, section: 'brass' },
    // Timpani (2 total)
    ...Array.from({ length: 2 }, (_, i) => ({
      id: generateId('mus'),
      name: `Timpani - Position ${i + 1}`,
      instrument: 'timpani',
      chair: i + 1,
      section: 'percussion' as const,
    })),
    // Percussion/Mallets (2 total)
    ...Array.from({ length: 2 }, (_, i) => ({
      id: generateId('mus'),
      name: `Percussion - Position ${i + 1}`,
      instrument: 'percussion',
      chair: i + 1,
      section: 'percussion' as const,
    })),
  ],
};

export const EXAMPLE_CONCERT_BAND: ExampleOrchestraConfig = {
  name: 'Concert Band (50 members)',
  description: 'Typical wind band configuration without strings',
  musicians: [
    // Piccolo
    { id: generateId('mus'), name: 'Piccolo', instrument: 'piccolo', chair: 1, section: 'woodwinds' },
    // Flute (2)
    ...Array.from({ length: 2 }, (_, i) => ({
      id: generateId('mus'),
      name: `Flute - Position ${i + 1}`,
      instrument: 'flute',
      chair: i + 1,
      section: 'woodwinds' as const,
    })),
    // Oboe (2)
    ...Array.from({ length: 2 }, (_, i) => ({
      id: generateId('mus'),
      name: `Oboe - Position ${i + 1}`,
      instrument: 'oboe',
      chair: i + 1,
      section: 'woodwinds' as const,
    })),
    // Clarinet - Eb (1)
    { id: generateId('mus'), name: 'Eb Clarinet', instrument: 'clarinet', chair: 1, section: 'woodwinds' },
    // Clarinet - Bb (6)
    ...Array.from({ length: 6 }, (_, i) => ({
      id: generateId('mus'),
      name: `Clarinet Bb - Position ${i + 1}`,
      instrument: 'clarinet',
      chair: i + 1,
      section: 'woodwinds' as const,
    })),
    // Bass Clarinet (1)
    { id: generateId('mus'), name: 'Bass Clarinet', instrument: 'bass-clarinet', chair: null, section: 'woodwinds' },
    // Saxophone Alto (2)
    ...Array.from({ length: 2 }, (_, i) => ({
      id: generateId('mus'),
      name: `Alto Saxophone - Position ${i + 1}`,
      instrument: 'saxophone',
      chair: i + 1,
      section: 'woodwinds' as const,
    })),
    // Saxophone Tenor (1)
    { id: generateId('mus'), name: 'Tenor Saxophone', instrument: 'saxophone', chair: 1, section: 'woodwinds' },
    // Saxophone Baritone (1)
    { id: generateId('mus'), name: 'Baritone Saxophone', instrument: 'saxophone', chair: 1, section: 'woodwinds' },
    // Bassoon (2)
    ...Array.from({ length: 2 }, (_, i) => ({
      id: generateId('mus'),
      name: `Bassoon - Position ${i + 1}`,
      instrument: 'bassoon',
      chair: i + 1,
      section: 'woodwinds' as const,
    })),
    // French Horn (4)
    ...Array.from({ length: 4 }, (_, i) => ({
      id: generateId('mus'),
      name: `French Horn - Position ${i + 1}`,
      instrument: 'french-horn',
      chair: i + 1,
      section: 'brass' as const,
    })),
    // Trumpet (3)
    ...Array.from({ length: 3 }, (_, i) => ({
      id: generateId('mus'),
      name: `Trumpet - Position ${i + 1}`,
      instrument: 'trumpet',
      chair: i + 1,
      section: 'brass' as const,
    })),
    // Trombone (3)
    ...Array.from({ length: 3 }, (_, i) => ({
      id: generateId('mus'),
      name: `Trombone - Position ${i + 1}`,
      instrument: 'trombone',
      chair: i + 1,
      section: 'brass' as const,
    })),
    // Tuba (2)
    ...Array.from({ length: 2 }, (_, i) => ({
      id: generateId('mus'),
      name: `Tuba - Position ${i + 1}`,
      instrument: 'tuba',
      chair: i + 1,
      section: 'brass' as const,
    })),
    // Percussion (3)
    ...Array.from({ length: 3 }, (_, i) => ({
      id: generateId('mus'),
      name: `Percussion - Position ${i + 1}`,
      instrument: 'percussion',
      chair: i + 1,
      section: 'percussion' as const,
    })),
  ],
};

export const EXAMPLE_CHAMBER_ORCHESTRA: ExampleOrchestraConfig = {
  name: 'Chamber Orchestra (28 members)',
  description: 'Small ensemble with lean instrumentation',
  musicians: [
    // Violin I (4)
    ...Array.from({ length: 4 }, (_, i) => ({
      id: generateId('mus'),
      name: `Violin I - Position ${i + 1}`,
      instrument: 'violin-1',
      chair: i + 1,
      section: 'strings' as const,
    })),
    // Violin II (3)
    ...Array.from({ length: 3 }, (_, i) => ({
      id: generateId('mus'),
      name: `Violin II - Position ${i + 1}`,
      instrument: 'violin-2',
      chair: i + 1,
      section: 'strings' as const,
    })),
    // Viola (2)
    ...Array.from({ length: 2 }, (_, i) => ({
      id: generateId('mus'),
      name: `Viola - Position ${i + 1}`,
      instrument: 'viola',
      chair: i + 1,
      section: 'strings' as const,
    })),
    // Cello (2)
    ...Array.from({ length: 2 }, (_, i) => ({
      id: generateId('mus'),
      name: `Cello - Position ${i + 1}`,
      instrument: 'cello',
      chair: i + 1,
      section: 'strings' as const,
    })),
    // Double Bass (1)
    { id: generateId('mus'), name: 'Double Bass', instrument: 'double-bass', chair: 1, section: 'strings' },
    // Flute (1)
    { id: generateId('mus'), name: 'Flute', instrument: 'flute', chair: 1, section: 'woodwinds' },
    // Oboe (1)
    { id: generateId('mus'), name: 'Oboe', instrument: 'oboe', chair: 1, section: 'woodwinds' },
    // Clarinet (1)
    { id: generateId('mus'), name: 'Clarinet', instrument: 'clarinet', chair: 1, section: 'woodwinds' },
    // Bassoon (1)
    { id: generateId('mus'), name: 'Bassoon', instrument: 'bassoon', chair: 1, section: 'woodwinds' },
    // French Horn (2)
    ...Array.from({ length: 2 }, (_, i) => ({
      id: generateId('mus'),
      name: `French Horn - Position ${i + 1}`,
      instrument: 'french-horn',
      chair: i + 1,
      section: 'brass' as const,
    })),
    // Trumpet (1)
    { id: generateId('mus'), name: 'Trumpet', instrument: 'trumpet', chair: 1, section: 'brass' },
    // Trombone (1)
    { id: generateId('mus'), name: 'Trombone', instrument: 'trombone', chair: 1, section: 'brass' },
    // Timpani/Percussion (2)
    ...Array.from({ length: 2 }, (_, i) => ({
      id: generateId('mus'),
      name: `Percussion - Position ${i + 1}`,
      instrument: 'percussion',
      chair: i + 1,
      section: 'percussion' as const,
    })),
  ],
};

export const EXAMPLE_ORCHESTRAS = {
  american: EXAMPLE_AMERICAN_ORCHESTRA,
  band: EXAMPLE_CONCERT_BAND,
  chamber: EXAMPLE_CHAMBER_ORCHESTRA,
};
