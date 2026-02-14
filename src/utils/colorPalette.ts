import type { InstrumentFamily } from '@/types/musician.ts';

export const SECTION_COLORS: Record<InstrumentFamily, string> = {
  strings:    '#4A90D9',
  woodwinds:  '#50B86C',
  brass:      '#E8A838',
  percussion: '#D94A4A',
  keyboard:   '#9B59B6',
  other:      '#95A5A6',
};

export const SECTION_COLORS_LIGHT: Record<InstrumentFamily, string> = {
  strings:    '#A8CCF0',
  woodwinds:  '#A8DEBC',
  brass:      '#F5D89A',
  percussion: '#F0A8A8',
  keyboard:   '#D4A8E8',
  other:      '#C8D0D4',
};

export const SECTION_DISPLAY_NAMES: Record<InstrumentFamily, string> = {
  strings:    'Strings',
  woodwinds:  'Woodwinds',
  brass:      'Brass',
  percussion: 'Percussion',
  keyboard:   'Keyboard',
  other:      'Other',
};
