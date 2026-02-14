import * as XLSX from 'xlsx';

export interface ParsedFileData {
  headers: string[];
  rows: string[][];
}

export function parseXLSX(file: File): Promise<ParsedFileData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          reject(new Error('XLSX file has no sheets'));
          return;
        }
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });
        const rows = jsonData.map((row) => row.map((cell) => String(cell ?? '')));

        if (rows.length === 0) {
          reject(new Error('XLSX file is empty'));
          return;
        }

        const headers = rows[0];
        const dataRows = rows.slice(1).filter((row) => row.some((cell) => cell.trim() !== ''));
        resolve({ headers, rows: dataRows });
      } catch (err) {
        reject(new Error(`XLSX parse error: ${err instanceof Error ? err.message : String(err)}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}
