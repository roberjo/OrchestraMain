import Papa from 'papaparse';

export interface ParsedFileData {
  headers: string[];
  rows: string[][];
}

export function parseCSV(file: File): Promise<ParsedFileData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as string[][];
        if (data.length === 0) {
          reject(new Error('CSV file is empty'));
          return;
        }
        const headers = data[0];
        const rows = data.slice(1);
        resolve({ headers, rows });
      },
      error: (error: Error) => {
        reject(new Error(`CSV parse error: ${error.message}`));
      },
    });
  });
}
