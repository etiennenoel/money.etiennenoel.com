import { CreateExpenseOptions } from '../options/create-expense.options';
import { Injectable } from '@angular/core';
import { CsvProcessorService, CsvPreviewData } from '../processors/csv.processor'; // Import CsvPreviewData
import { PdfProcessor } from '../processors/pdf.processor';
import { ImageProcessorService } from '../processors/image.processor';

// Define PreviewData type
export type PreviewData = CsvPreviewData | string[] | string | null;

@Injectable({
  providedIn: 'root'
})
export class StatementImporter {
  constructor(
    private csvProcessor: CsvProcessorService,
    private pdfProcessor: PdfProcessor,
    private imageProcessor: ImageProcessorService
  ) {}

  // Helper function to resize ImageBitmap
  private async resizeImageBitmap(imageBitmap: ImageBitmap, width: number, height: number): Promise<ImageBitmap> {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      // Fallback or error handling if context is not available
      console.error('Could not get canvas context for resizing. Returning original bitmap.');
      // Depending on strictness, could throw error or return original
      return imageBitmap;
    }
    ctx.drawImage(imageBitmap, 0, 0, width, height);
    return await createImageBitmap(canvas);
  }

  async extractPreviewData(file: File): Promise<PreviewData> {
    console.log('Extracting preview data for:', file.name, file.type);
    if (file.type === 'text/csv') {
      return this.csvProcessor.extractPreview(file);
    } else if (file.type === 'application/pdf') {
      return this.pdfProcessor.extractPreview(file);
    } else if (file.type.startsWith('image/')) {
      return this.imageProcessor.extractPreview(file);
    } else {
      console.warn('Unsupported file type for preview:', file.type);
      return null;
    }
  }

  async processStatementForLLM(file: File): Promise<CreateExpenseOptions[]> {
    console.log('Processing file with LLM in StatementImporter:', file.name, file.type);

    // @ts-expect-error LanguageModel is not defined here, assuming it's a global or needs import
    const session = await LanguageModel.create({
      expectedInputs: [{ type: "text" }, { type: "image" }],
    });

    const properties = Object.keys(new CreateExpenseOptions());
    const extractionPrompt = `Transform this image into JSON by extracting all the expenses you find in this bank statement or receipt. Return an array of expenses containing these properties: ${properties.join(', ')}. If a property is not applicable, you can omit it or set its value to null. Only identify expenses.`;
    const jsonSchema = {
      "responseConstraint": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "Expenses",
        "description": "An array of expenses",
        "type": "array",
        "items": {
          "type": "object",
          "title": "Expense",
          "description": "A single expense record",
          "required": [
            "id",
            "createdAt",
            "transactionDate",
            "amount",
            "currency",
            "location",
            "description",
            "categories",
            "labels"
          ],
          "properties": {
            "id": { "type": "string", "description": "Unique identifier for the expense", "format": "uuid" },
            "createdAt": { "type": "string", "description": "The date and time the expense record was created", "format": "date-time" },
            "transactionDate": { "type": "string", "description": "The date and time of the financial transaction", "format": "date-time" },
            "amount": { "type": "number", "description": "The monetary value of the expense" },
            "currency": { "type": "string", "description": "The currency of the amount" },
            "location": { "type": "string", "description": "The location where the expense occurred" },
            "description": { "type": "string", "description": "A brief description of the expense" },
            "categories": { "type": "array", "description": "A list of categories for the expense", "items": { "type": "string" } },
            "labels": { "type": "array", "description": "A list of labels for the expense", "items": { "type": "string" } }
          }
        }
      }
    };

    if (file.type === 'text/csv') {
      const records = await this.csvProcessor.processCsv(file);
      if (!records || records.length === 0) return [];
      const headers = Object.keys(records[0]);
      const mappingPrompt = `Given the CSV headers: ${headers.join(', ')}, map them to the following properties: ${properties.join(', ')}. Provide the mapping as a JSON object where keys are CSV headers and values are property names.`;
      const mappingConfig = await session.prompt(mappingPrompt);
      let parsedMapping: Record<string, string>;
      try {
        parsedMapping = JSON.parse(mappingConfig);
      } catch (error) {
        console.error('Error parsing mapping configuration:', error);
        return [];
      }
      return records.map(record => {
        const expenseOptions = new CreateExpenseOptions();
        for (const header in parsedMapping) {
          if (record.hasOwnProperty(header) && expenseOptions.hasOwnProperty(parsedMapping[header])) {
            (expenseOptions as any)[parsedMapping[header]] = record[header];
          }
        }
        return expenseOptions;
      });

    } else if (file.type === 'application/pdf') {
      const imageBitmaps = await this.pdfProcessor.convertToImages(file);
      const allExpenseOptions: CreateExpenseOptions[] = [];
      if (!imageBitmaps || imageBitmaps.length === 0) return [];

      for (const bitmap of imageBitmaps) {
        const resizedBitmap = await this.resizeImageBitmap(bitmap, 768, 768);
        try {
          const extractedDataString = await session.prompt([
            { role: "user", content: extractionPrompt },
            { role: "user", content: [{ type: "image", value: resizedBitmap }] }
          ], jsonSchema);
          if (extractedDataString) {
            const parsedData = JSON.parse(extractedDataString);
            const itemsToProcess = Array.isArray(parsedData) ? parsedData : [parsedData];
            for (const item of itemsToProcess) {
              const expenseOptions = new CreateExpenseOptions();
              for (const property of properties) {
                if (item.hasOwnProperty(property)) {
                  (expenseOptions as any)[property] = item[property];
                }
              }
              allExpenseOptions.push(expenseOptions);
            }
          }
        } catch (error) {
          console.error('Error processing PDF image with LLM:', error);
        }
      }
      return allExpenseOptions;

    } else if (file.type.startsWith('image/')) {
      const imageBitmap = await this.imageProcessor.processImage(file);
      if (!imageBitmap) return [];
      const resizedBitmap = await this.resizeImageBitmap(imageBitmap, 768, 768);
      const allExpenseOptions: CreateExpenseOptions[] = [];
      try {
        const extractedDataString = await session.prompt([
          { role: "user", content: extractionPrompt },
          { role: "user", content: [{ type: "image", value: resizedBitmap }] }
        ], jsonSchema);
        if (extractedDataString) {
          const parsedData = JSON.parse(extractedDataString);
          const itemsToProcess = Array.isArray(parsedData) ? parsedData : [parsedData];
          for (const item of itemsToProcess) {
            const expenseOptions = new CreateExpenseOptions();
            for (const property of properties) {
                if (item.hasOwnProperty(property)) {
                  (expenseOptions as any)[property] = item[property];
                }
              }
            allExpenseOptions.push(expenseOptions);
          }
        }
      } catch (error) {
        console.error('Error processing image with LLM:', error);
      }
      return allExpenseOptions;
    } else {
      console.warn('Unsupported file type for LLM processing:', file.type);
      return [];
    }
  }
}
