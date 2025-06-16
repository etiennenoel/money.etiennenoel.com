import { CreateExpenseOptions } from '../options/create-expense.options';
import { Injectable } from '@angular/core';
import { CsvProcessorService } from '../services/csv.processor';
import { PdfProcessor } from '../services/pdf.processor';

@Injectable({
  providedIn: 'root'
})
export class StatementImporter {
  constructor(
    private csvProcessor: CsvProcessorService,
    private pdfProcessor: PdfProcessor
  ) {}

  async process(file: File): Promise<CreateExpenseOptions[]> {
    console.log('Processing file in StatementImporter:', file.name);

    if (file.type === 'text/csv') {
      const records = await this.csvProcessor.processCsv(file); // Changed this line
      // TODO: Convert records to CreateExpenseOptions[]
      console.log('CSV records:', records);
      return Promise.resolve([]); // Placeholder
    } else if (file.type === 'application/pdf') {
      const images = await this.pdfProcessor.convertToImages(file);
      // TODO: Process images to extract expense data
      console.log('PDF images:', images);
      return Promise.resolve([]); // Placeholder
    } else {
      console.warn('Unsupported file type:', file.type);
      return Promise.resolve([]);
    }
  }
}
