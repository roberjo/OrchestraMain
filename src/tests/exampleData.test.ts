import { describe, it, expect } from 'vitest';
import { EXAMPLE_ORCHESTRAS } from '@/utils/exampleData.ts';
import { INSTRUMENTS } from '@/engine/instrumentTaxonomy.ts';

describe('Example Data', () => {
  describe('EXAMPLE_ORCHESTRAS', () => {
    it('should have three example configurations', () => {
      expect(EXAMPLE_ORCHESTRAS.american).toBeDefined();
      expect(EXAMPLE_ORCHESTRAS.band).toBeDefined();
      expect(EXAMPLE_ORCHESTRAS.chamber).toBeDefined();
    });

    it('should have names for all examples', () => {
      expect(EXAMPLE_ORCHESTRAS.american.name.length).toBeGreaterThan(0);
      expect(EXAMPLE_ORCHESTRAS.band.name.length).toBeGreaterThan(0);
      expect(EXAMPLE_ORCHESTRAS.chamber.name.length).toBeGreaterThan(0);
    });

    it('should have musicians in each example', () => {
      expect(EXAMPLE_ORCHESTRAS.american.musicians.length).toBeGreaterThan(0);
      expect(EXAMPLE_ORCHESTRAS.band.musicians.length).toBeGreaterThan(0);
      expect(EXAMPLE_ORCHESTRAS.chamber.musicians.length).toBeGreaterThan(0);
    });

    it('American Symphony should have ~46 musicians', () => {
      expect(EXAMPLE_ORCHESTRAS.american.musicians.length).toBeGreaterThanOrEqual(40);
      expect(EXAMPLE_ORCHESTRAS.american.musicians.length).toBeLessThanOrEqual(55);
    });

    it('Concert Band should have ~34 musicians', () => {
      expect(EXAMPLE_ORCHESTRAS.band.musicians.length).toBeGreaterThanOrEqual(30);
      expect(EXAMPLE_ORCHESTRAS.band.musicians.length).toBeLessThanOrEqual(45);
    });

    it('Chamber Orchestra should have ~28 musicians', () => {
      expect(EXAMPLE_ORCHESTRAS.chamber.musicians.length).toBeGreaterThanOrEqual(20);
      expect(EXAMPLE_ORCHESTRAS.chamber.musicians.length).toBeLessThanOrEqual(35);
    });

    it('all musicians should have valid instrument IDs', () => {
      for (const [key, config] of Object.entries(EXAMPLE_ORCHESTRAS)) {
        for (const musician of config.musicians) {
          expect(
            INSTRUMENTS[musician.instrument],
            `${key}: musician "${musician.name}" has invalid instrument "${musician.instrument}"`,
          ).toBeDefined();
        }
      }
    });

    it('all musicians should have unique IDs within their example', () => {
      for (const [_key, config] of Object.entries(EXAMPLE_ORCHESTRAS)) {
        const ids = config.musicians.map((m) => m.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
      }
    });

    it('all musicians should have non-empty names', () => {
      for (const config of Object.values(EXAMPLE_ORCHESTRAS)) {
        for (const musician of config.musicians) {
          expect(musician.name.length).toBeGreaterThan(0);
        }
      }
    });

    it('all musicians should have valid section assignments matching their instrument', () => {
      for (const config of Object.values(EXAMPLE_ORCHESTRAS)) {
        for (const musician of config.musicians) {
          const instrument = INSTRUMENTS[musician.instrument];
          if (instrument) {
            expect(musician.section).toBe(instrument.family);
          }
        }
      }
    });

    it('Concert Band should not have string instruments', () => {
      const bandMusicians = EXAMPLE_ORCHESTRAS.band.musicians;
      const stringPlayers = bandMusicians.filter((m) => m.section === 'strings');
      expect(stringPlayers.length).toBe(0);
    });
  });
});
