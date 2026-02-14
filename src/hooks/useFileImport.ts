import { useState, useCallback } from 'react';
import { parseCSV } from '@/utils/csvParser.ts';
import { parseXLSX } from '@/utils/xlsxParser.ts';
import { resolveInstrument, INSTRUMENTS } from '@/engine/instrumentTaxonomy.ts';
import { generateId } from '@/utils/idGenerator.ts';
import type { Musician } from '@/types/musician.ts';
import type { ColumnMapping, ImportResult } from '@/types/import.ts';

interface ParsedFileData {
  headers: string[];
  rows: string[][];
}

const NAME_HINTS = ['name', 'musician', 'player', 'member', 'first name', 'last name', 'full name'];
const INSTRUMENT_HINTS = ['instrument', 'instr', 'part', 'section', 'voice'];
const CHAIR_HINTS = ['chair', 'stand', 'desk', 'seat', 'position', 'rank', 'number', '#'];

function autoDetectColumn(headers: string[], hints: string[]): string | null {
  const lower = headers.map((h) => h.toLowerCase().trim());
  for (const hint of hints) {
    const idx = lower.findIndex((h) => h === hint || h.includes(hint));
    if (idx !== -1) return headers[idx];
  }
  return null;
}

export function autoDetectMapping(headers: string[]): ColumnMapping {
  return {
    nameColumn: autoDetectColumn(headers, NAME_HINTS),
    instrumentColumn: autoDetectColumn(headers, INSTRUMENT_HINTS),
    chairColumn: autoDetectColumn(headers, CHAIR_HINTS),
    sectionColumn: null,
  };
}

export function processImport(
  headers: string[],
  rows: string[][],
  mapping: ColumnMapping,
): ImportResult {
  const musicians: Musician[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];
  const unmappedInstruments: string[] = [];

  const nameIdx = mapping.nameColumn ? headers.indexOf(mapping.nameColumn) : -1;
  const instrIdx = mapping.instrumentColumn ? headers.indexOf(mapping.instrumentColumn) : -1;
  const chairIdx = mapping.chairColumn ? headers.indexOf(mapping.chairColumn) : -1;

  if (nameIdx === -1) {
    errors.push('No name column mapped');
    return { musicians, warnings, errors, unmappedInstruments };
  }
  if (instrIdx === -1) {
    errors.push('No instrument column mapped');
    return { musicians, warnings, errors, unmappedInstruments };
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const name = row[nameIdx]?.trim() ?? '';
    const instrRaw = row[instrIdx]?.trim() ?? '';
    const chairRaw = chairIdx >= 0 ? row[chairIdx]?.trim() : '';

    if (!name) {
      warnings.push(`Row ${i + 2}: Empty name, skipping`);
      continue;
    }
    if (!instrRaw) {
      warnings.push(`Row ${i + 2}: Empty instrument for "${name}", skipping`);
      continue;
    }

    const instrumentId = resolveInstrument(instrRaw);
    if (!instrumentId) {
      warnings.push(`Row ${i + 2}: Unknown instrument "${instrRaw}" for "${name}"`);
      if (!unmappedInstruments.includes(instrRaw)) {
        unmappedInstruments.push(instrRaw);
      }
      continue;
    }

    const instrument = INSTRUMENTS[instrumentId];
    const chair = chairRaw ? parseInt(chairRaw, 10) : null;

    musicians.push({
      id: generateId('m'),
      name,
      instrument: instrumentId,
      chair: chair && !isNaN(chair) ? chair : null,
      section: instrument.family,
    });
  }

  return { musicians, warnings, errors, unmappedInstruments };
}

export function useFileImport() {
  const [parsedData, setParsedData] = useState<ParsedFileData | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping>({
    nameColumn: null,
    instrumentColumn: null,
    chairColumn: null,
    sectionColumn: null,
  });
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setParsedData(null);
    setImportResult(null);

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let data: ParsedFileData;

      if (ext === 'csv') {
        data = await parseCSV(file);
      } else if (ext === 'xlsx' || ext === 'xls') {
        data = await parseXLSX(file);
      } else {
        throw new Error(`Unsupported file type: .${ext}. Use .csv or .xlsx`);
      }

      setParsedData(data);
      const autoMapping = autoDetectMapping(data.headers);
      setMapping(autoMapping);

      // Auto-process if we have valid mappings
      if (autoMapping.nameColumn && autoMapping.instrumentColumn) {
        const result = processImport(data.headers, data.rows, autoMapping);
        setImportResult(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateMapping = useCallback(
    (newMapping: ColumnMapping) => {
      setMapping(newMapping);
      if (parsedData && newMapping.nameColumn && newMapping.instrumentColumn) {
        const result = processImport(parsedData.headers, parsedData.rows, newMapping);
        setImportResult(result);
      }
    },
    [parsedData],
  );

  const reset = useCallback(() => {
    setParsedData(null);
    setMapping({ nameColumn: null, instrumentColumn: null, chairColumn: null, sectionColumn: null });
    setImportResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    parsedData,
    mapping,
    importResult,
    isLoading,
    error,
    parseFile,
    updateMapping,
    reset,
  };
}
