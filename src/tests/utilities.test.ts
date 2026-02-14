import { describe, it, expect } from 'vitest';
import { SECTION_COLORS } from '@/utils/colorPalette.ts';
import { generateId } from '@/utils/idGenerator.ts';
import type { InstrumentFamily } from '@/types/musician.ts';

describe('Utilities', () => {
  describe('colorPalette', () => {
    it('should have colors for all sections', () => {
      const sections: InstrumentFamily[] = ['strings', 'woodwinds', 'brass', 'percussion', 'keyboard'];

      sections.forEach((section) => {
        expect(SECTION_COLORS[section]).toBeDefined();
        expect(SECTION_COLORS[section]).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    it('should have distinct colors for different sections', () => {
      const sections: InstrumentFamily[] = ['strings', 'woodwinds', 'brass', 'percussion', 'keyboard'];
      const colors = sections.map((s) => SECTION_COLORS[s]);

      // Check for uniqueness
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(sections.length);
    });

    it('should return valid hex colors', () => {
      const sections: InstrumentFamily[] = ['strings', 'woodwinds', 'brass', 'percussion', 'keyboard'];

      sections.forEach((section) => {
        const color = SECTION_COLORS[section];
        // Should be 6-digit hex color
        expect(color.length).toBe(7); // #RRGGBB
        expect(color.startsWith('#')).toBe(true);
      });
    });
  });

  describe('idGenerator', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(id1).not.toBe(id2);
    });

    it('should generate non-empty IDs', () => {
      const id = generateId();
      expect(id.length).toBeGreaterThan(0);
    });

    it('should generate multiple unique IDs', () => {
      const ids = Array.from({ length: 100 }, () => generateId());
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(100);
    });
  });
});
