import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CsvProcessorService {

  constructor() { }

  processCsv(csvData: string): Record<string, string>[] {
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
}
