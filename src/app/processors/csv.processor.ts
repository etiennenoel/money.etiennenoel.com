import { Injectable } from '@angular/core';

export interface CsvPreviewData {
  headers: string[];
  rows: Record<string, string>[];
}

@Injectable({
  providedIn: 'root'
})
export class CsvProcessorService {

  constructor() { }

  async processCsv(file: File): Promise<Record<string, string>[]> {
    if (!file) {
      return [];
    }

    const csvData = await file.text();
    if (!csvData) {
      return [];
    }

    const lines = csvData.trim().split('\n');
    if (lines.length < 1) {
      return [];
    }

    const headers = lines[0].split(',').map(header => header.trim());
    const records: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(value => value.trim());
      if (values.length === headers.length) {
        const record: Record<string, string> = {};
        headers.forEach((header, index) => {
          record[header] = values[index];
        });
        records.push(record);
      }
    }
    return records;
  }

  async processData(file: File): Promise<CsvPreviewData> {
    if (!file) {
      return { headers: [], rows: [] };
    }

    const csvData = await file.text();
    if (!csvData) {
      return { headers: [], rows: [] };
    }

    const lines = csvData.trim().split('\n');
    if (lines.length < 1) { // Should have at least a header row
      return { headers: [], rows: [] };
    }

    const headers = lines[0].split(',').map(header => header.trim());
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) { // Data rows start from the second line
      const values = lines[i].split(',').map(value => value.trim());
      // Only include rows that have the same number of columns as headers
      if (values.length === headers.length) {
        const record: Record<string, string> = {};
        headers.forEach((header, index) => {
          record[header] = values[index];
        });
        rows.push(record);
      }
    }
    return { headers, rows };
  }
}
