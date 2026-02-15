import { describe, it, expect } from 'vitest';
import { autoDetectMapping, processImport } from '@/hooks/useFileImport.ts';
import type { ColumnMapping } from '@/types/import.ts';

describe('Import System', () => {
  describe('autoDetectMapping', () => {
    it('should detect standard column names', () => {
      const headers = ['Name', 'Instrument', 'Chair'];
      const mapping = autoDetectMapping(headers);

      expect(mapping.nameColumn).toBe('Name');
      expect(mapping.instrumentColumn).toBe('Instrument');
      expect(mapping.chairColumn).toBe('Chair');
    });

    it('should be case-insensitive', () => {
      const headers = ['name', 'instrument', 'chair'];
      const mapping = autoDetectMapping(headers);

      expect(mapping.nameColumn).toBe('name');
      expect(mapping.instrumentColumn).toBe('instrument');
      expect(mapping.chairColumn).toBe('chair');
    });

    it('should detect alternative column names', () => {
      const headers = ['Player', 'Part', 'Stand'];
      const mapping = autoDetectMapping(headers);

      expect(mapping.nameColumn).toBe('Player');
      expect(mapping.instrumentColumn).toBe('Part');
      expect(mapping.chairColumn).toBe('Stand');
    });

    it('should detect partial matches', () => {
      const headers = ['Musician Name', 'Instrument/Part', 'Seat Number'];
      const mapping = autoDetectMapping(headers);

      expect(mapping.nameColumn).toBe('Musician Name');
      expect(mapping.instrumentColumn).toBe('Instrument/Part');
      expect(mapping.chairColumn).toBe('Seat Number');
    });

    it('should return null for undetectable columns', () => {
      const headers = ['Col A', 'Col B', 'Col C'];
      const mapping = autoDetectMapping(headers);

      expect(mapping.nameColumn).toBeNull();
      expect(mapping.instrumentColumn).toBeNull();
      expect(mapping.chairColumn).toBeNull();
    });
  });

  describe('processImport', () => {
    const validMapping: ColumnMapping = {
      nameColumn: 'Name',
      instrumentColumn: 'Instrument',
      chairColumn: 'Chair',
      sectionColumn: null,
    };

    it('should process valid CSV data', () => {
      const headers = ['Name', 'Instrument', 'Chair'];
      const rows = [
        ['Jane Smith', '1st Violin', '1'],
        ['John Doe', 'Flute', '2'],
      ];

      const result = processImport(headers, rows, validMapping);

      expect(result.musicians.length).toBe(2);
      expect(result.errors.length).toBe(0);
      expect(result.musicians[0].name).toBe('Jane Smith');
      expect(result.musicians[0].instrument).toBe('violin-1');
      expect(result.musicians[0].section).toBe('strings');
      expect(result.musicians[0].chair).toBe(1);

      expect(result.musicians[1].name).toBe('John Doe');
      expect(result.musicians[1].instrument).toBe('flute');
      expect(result.musicians[1].section).toBe('woodwinds');
    });

    it('should skip rows with empty names', () => {
      const headers = ['Name', 'Instrument', 'Chair'];
      const rows = [
        ['', 'Violin', '1'],
        ['John', 'Flute', '2'],
      ];

      const result = processImport(headers, rows, validMapping);

      expect(result.musicians.length).toBe(1);
      expect(result.warnings.length).toBe(1);
      expect(result.warnings[0]).toContain('Empty name');
    });

    it('should skip rows with empty instruments', () => {
      const headers = ['Name', 'Instrument', 'Chair'];
      const rows = [
        ['Jane', '', '1'],
        ['John', 'Flute', '2'],
      ];

      const result = processImport(headers, rows, validMapping);

      expect(result.musicians.length).toBe(1);
      expect(result.warnings.length).toBe(1);
      expect(result.warnings[0]).toContain('Empty instrument');
    });

    it('should warn about unknown instruments', () => {
      const headers = ['Name', 'Instrument', 'Chair'];
      const rows = [
        ['Jane', 'Kazoo', '1'],
        ['John', 'Flute', '2'],
      ];

      const result = processImport(headers, rows, validMapping);

      expect(result.musicians.length).toBe(1);
      expect(result.warnings.length).toBe(1);
      expect(result.unmappedInstruments).toContain('Kazoo');
    });

    it('should handle missing chair numbers gracefully', () => {
      const headers = ['Name', 'Instrument', 'Chair'];
      const rows = [
        ['Jane', 'Flute', ''],
      ];

      const result = processImport(headers, rows, validMapping);

      expect(result.musicians.length).toBe(1);
      expect(result.musicians[0].chair).toBeNull();
    });

    it('should resolve instrument aliases', () => {
      const headers = ['Name', 'Instrument', 'Chair'];
      const rows = [
        ['Jane', 'Vln 1', '1'],
        ['Bob', 'Vc', '1'],
        ['Carol', 'Ob', '1'],
        ['Dave', 'Hn', '1'],
      ];

      const result = processImport(headers, rows, validMapping);

      expect(result.musicians.length).toBe(4);
      expect(result.musicians[0].instrument).toBe('violin-1');
      expect(result.musicians[1].instrument).toBe('cello');
      expect(result.musicians[2].instrument).toBe('oboe');
      expect(result.musicians[3].instrument).toBe('french-horn');
    });

    it('should error when name column is unmapped', () => {
      const mapping: ColumnMapping = {
        nameColumn: null,
        instrumentColumn: 'Instrument',
        chairColumn: null,
        sectionColumn: null,
      };

      const result = processImport(['Name', 'Instrument'], [], mapping);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toContain('No name column');
    });

    it('should error when instrument column is unmapped', () => {
      const mapping: ColumnMapping = {
        nameColumn: 'Name',
        instrumentColumn: null,
        chairColumn: null,
        sectionColumn: null,
      };

      const result = processImport(['Name', 'Instrument'], [], mapping);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toContain('No instrument column');
    });

    it('should generate unique IDs for each musician', () => {
      const headers = ['Name', 'Instrument', 'Chair'];
      const rows = [
        ['Jane', 'Flute', '1'],
        ['John', 'Flute', '2'],
        ['Bob', 'Flute', '3'],
      ];

      const result = processImport(headers, rows, validMapping);
      const ids = result.musicians.map((m) => m.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);
    });
  });
});
