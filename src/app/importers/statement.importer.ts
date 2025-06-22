import { CreateExpenseOptions } from '../options/create-expense.options';
import { Injectable } from '@angular/core';
import { CsvProcessor } from '../processors/csv.processor'; // Import CsvPreviewData
import { PdfProcessor } from '../processors/pdf.processor';
import { ImageProcessor } from '../processors/image.processor';
import {DataMapper} from '@pristine-ts/data-mapping-common';
import {PreviewData} from '../types/preview-data.type';

@Injectable({
  providedIn: 'root'
})
export class StatementImporter {
  constructor(
    private readonly csvProcessor: CsvProcessor,
    private readonly pdfProcessor: PdfProcessor,
    private readonly imageProcessor: ImageProcessor,
  ) {
  }

  async extractPreviewData(file: File): Promise<PreviewData> {
    console.log('Extracting preview data for:', file.name, file.type);
    switch (file.type) {
      case 'text/csv':
        return this.csvProcessor.extract(file);
      case 'application/pdf':
        return this.pdfProcessor.extract(file);
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
        return this.imageProcessor.extract(file);
      default:
        console.warn('Unsupported file type for preview:', file.type);
        return null;
    }
  }

  async process(file: File): Promise<CreateExpenseOptions[]> {
    console.log('Processing file with LLM in StatementImporter:', file.name, file.type);

    switch (file.type) {
      case 'text/csv':
        return this.csvProcessor.extractCreateExpenseOptions(file);
      case 'application/pdf':
        return this.pdfProcessor.extractCreateExpenseOptions(file);
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
        return this.imageProcessor.extractCreateExpenseOptions(file);
      default:
        const message = `Unsupported file type for LLM processing: ${file.type}`;
        console.warn(message);
        throw new Error(message);
    }
  }
}
