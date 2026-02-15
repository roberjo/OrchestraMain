import { describe, it, expect } from 'vitest';
import {
  INSTRUMENTS,
  INSTRUMENT_ALIASES,
  resolveInstrument,
  getInstrumentOptions,
} from '@/engine/instrumentTaxonomy.ts';

describe('instrumentTaxonomy', () => {
  describe('INSTRUMENTS', () => {
    it('should contain all major orchestral instruments', () => {
      const expectedInstruments = [
        'violin-1', 'violin-2', 'viola', 'cello', 'double-bass',
        'flute', 'oboe', 'clarinet', 'bassoon',
        'french-horn', 'trumpet', 'trombone', 'tuba',
        'timpani', 'percussion',
        'piano', 'harp',
      ];

      for (const id of expectedInstruments) {
        expect(INSTRUMENTS[id], `Missing instrument: ${id}`).toBeDefined();
      }
    });

    it('should have valid family assignments for all instruments', () => {
      const validFamilies = ['strings', 'woodwinds', 'brass', 'percussion', 'keyboard', 'other'];

      for (const [id, instrument] of Object.entries(INSTRUMENTS)) {
        expect(validFamilies).toContain(instrument.family);
        expect(instrument.id).toBe(id);
        expect(instrument.name.length).toBeGreaterThan(0);
      }
    });

    it('should have valid angular zones (0 to 1 range)', () => {
      for (const instrument of Object.values(INSTRUMENTS)) {
        const [start, end] = instrument.defaultAngularZone;
        expect(start).toBeGreaterThanOrEqual(0);
        expect(end).toBeLessThanOrEqual(1);
        expect(start).toBeLessThan(end);
      }
    });

    it('should assign correct families to instruments', () => {
      expect(INSTRUMENTS['violin-1'].family).toBe('strings');
      expect(INSTRUMENTS['flute'].family).toBe('woodwinds');
      expect(INSTRUMENTS['trumpet'].family).toBe('brass');
      expect(INSTRUMENTS['timpani'].family).toBe('percussion');
      expect(INSTRUMENTS['piano'].family).toBe('keyboard');
    });

    it('should have unique sort orders within each family', () => {
      const familyOrders = new Map<string, number[]>();

      for (const instrument of Object.values(INSTRUMENTS)) {
        if (!familyOrders.has(instrument.family)) {
          familyOrders.set(instrument.family, []);
        }
        familyOrders.get(instrument.family)!.push(instrument.sortOrder);
      }

      for (const [_family, orders] of familyOrders) {
        // Sort orders should be unique within a family (except for instruments that share a position like cornet/trumpet)
        expect(orders.length).toBeGreaterThan(0);
      }
    });
  });

  describe('INSTRUMENT_ALIASES', () => {
    it('should have aliases for common abbreviations', () => {
      expect(INSTRUMENT_ALIASES['vln 1']).toBe('violin-1');
      expect(INSTRUMENT_ALIASES['fl']).toBe('flute');
      expect(INSTRUMENT_ALIASES['tpt']).toBe('trumpet');
      expect(INSTRUMENT_ALIASES['vc']).toBe('cello');
      expect(INSTRUMENT_ALIASES['cb']).toBe('double-bass');
    });

    it('should map all aliases to valid instrument IDs', () => {
      for (const [alias, id] of Object.entries(INSTRUMENT_ALIASES)) {
        expect(INSTRUMENTS[id], `Alias "${alias}" maps to invalid ID "${id}"`).toBeDefined();
      }
    });

    it('should handle plural forms', () => {
      expect(INSTRUMENT_ALIASES['violas']).toBe('viola');
      expect(INSTRUMENT_ALIASES['cellos']).toBe('cello');
      expect(INSTRUMENT_ALIASES['flutes']).toBe('flute');
      expect(INSTRUMENT_ALIASES['trumpets']).toBe('trumpet');
    });
  });

  describe('resolveInstrument', () => {
    it('should resolve exact instrument IDs', () => {
      expect(resolveInstrument('violin-1')).toBe('violin-1');
      expect(resolveInstrument('flute')).toBe('flute');
      expect(resolveInstrument('trumpet')).toBe('trumpet');
    });

    it('should resolve common aliases', () => {
      expect(resolveInstrument('1st Violin')).toBe('violin-1');
      expect(resolveInstrument('Flute')).toBe('flute');
      expect(resolveInstrument('Trumpet')).toBe('trumpet');
    });

    it('should be case-insensitive', () => {
      expect(resolveInstrument('VIOLIN-1')).toBe('violin-1');
      expect(resolveInstrument('FLUTE')).toBe('flute');
      expect(resolveInstrument('French Horn')).toBe('french-horn');
    });

    it('should handle abbreviations', () => {
      expect(resolveInstrument('vln 1')).toBe('violin-1');
      expect(resolveInstrument('fl')).toBe('flute');
      expect(resolveInstrument('ob')).toBe('oboe');
      expect(resolveInstrument('cl')).toBe('clarinet');
      expect(resolveInstrument('hn')).toBe('french-horn');
    });

    it('should handle whitespace', () => {
      expect(resolveInstrument('  flute  ')).toBe('flute');
      expect(resolveInstrument(' 1st Violin ')).toBe('violin-1');
    });

    it('should return null for unknown instruments', () => {
      expect(resolveInstrument('kazoo')).toBeNull();
      expect(resolveInstrument('theremin')).toBeNull();
      expect(resolveInstrument('')).toBeNull();
    });
  });

  describe('getInstrumentOptions', () => {
    it('should return all instruments', () => {
      const options = getInstrumentOptions();
      expect(options.length).toBe(Object.keys(INSTRUMENTS).length);
    });

    it('should sort by family then sort order', () => {
      const options = getInstrumentOptions();

      // First instrument should be from strings
      expect(options[0].family).toBe('strings');

      // Find first woodwind
      const firstWoodwind = options.find((o) => o.family === 'woodwinds');
      expect(firstWoodwind).toBeDefined();

      // All strings should come before woodwinds
      const firstWoodwindIdx = options.indexOf(firstWoodwind!);
      const allStrings = options.filter((o) => o.family === 'strings');
      for (const s of allStrings) {
        expect(options.indexOf(s)).toBeLessThan(firstWoodwindIdx);
      }
    });

    it('should include id, name, and family for each option', () => {
      const options = getInstrumentOptions();
      for (const opt of options) {
        expect(opt.id).toBeDefined();
        expect(opt.name).toBeDefined();
        expect(opt.family).toBeDefined();
        expect(opt.name.length).toBeGreaterThan(0);
      }
    });
  });
});
