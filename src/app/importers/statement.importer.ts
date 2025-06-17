import { CreateExpenseOptions } from '../options/create-expense.options';
import { Injectable } from '@angular/core';
import { CsvProcessorService } from '../processors/csv.processor';
import { PdfProcessor } from '../processors/pdf.processor';
import { ImageProcessorService } from '../processors/image.processor'; // Import ImageProcessorService

@Injectable({
  providedIn: 'root'
})
export class StatementImporter {
  constructor(
    private csvProcessor: CsvProcessorService,
    private pdfProcessor: PdfProcessor,
    private imageProcessor: ImageProcessorService // Inject ImageProcessorService
  ) {}

  async process(file: File): Promise<CreateExpenseOptions[]> {
    console.log('Processing file in StatementImporter:', file.name, file.type);

    // @ts-expect-error
    const session = await LanguageModel.create({
      expectedInputs: [
        {
          type: "text",
        },{
          type: "image",
        },
      ],
    });

    const properties = Object.keys(new CreateExpenseOptions());
    const extractionPrompt = `Transform this image into JSON by extracting all the expenses you find in this bank statement or receipt. Return an array of expenses containing these properties: ${properties.join(', ')}. If a property is not applicable, you can omit it or set its value to null. Only identify expenses.`;
    const jsonSchema = {
      responseConstraint: {
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
      if (!records || records.length === 0) {
        return [];
      }

      const headers = Object.keys(records[0]);
      // const properties = Object.keys(new CreateExpenseOptions()); // Already defined above

      const mappingPrompt = `Given the CSV headers: ${headers.join(', ')}, map them to the following properties: ${properties.join(', ')}. Provide the mapping as a JSON object where keys are CSV headers and values are property names.`;

      const mappingConfig = await session.prompt(mappingPrompt);

      let parsedMapping: Record<string, string>;
      try {
        parsedMapping = JSON.parse(mappingConfig);
      } catch (error) {
        console.error('Error parsing mapping configuration:', error);
        return [];
      }

      const createExpenseOptionsArray = records.map(record => {
        const expenseOptions = new CreateExpenseOptions();
        for (const header in parsedMapping) {
          if (record.hasOwnProperty(header) && expenseOptions.hasOwnProperty(parsedMapping[header])) {
            (expenseOptions as any)[parsedMapping[header]] = record[header];
          }
        }
        return expenseOptions;
      });

      return createExpenseOptionsArray;
    } else if (file.type === 'application/pdf') {
      const images = await this.pdfProcessor.convertToImages(file);
      const allExpenseOptions: CreateExpenseOptions[] = [];

      if (!images || images.length === 0) {
        console.log('No images extracted from PDF.');
        return [];
      }

      for (const image of images) {
        try {
          const extractedDataString = await session.prompt([
            { role: "user", content: extractionPrompt },
            { role: "user", content: [{ type: "image", value: image }] }
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
          console.error('Error processing PDF image extraction or parsing JSON:', error);
        }
      }
      return allExpenseOptions;
    } else if (file.type.startsWith('image/')) { // Handle image files
      const imageBitmap = await this.imageProcessor.processImage(file);
      const allExpenseOptions: CreateExpenseOptions[] = [];

      if (!imageBitmap) {
        console.log('No image bitmap processed from the file.');
        return [];
      }

      try {
        const extractedDataString = await session.prompt([
          { role: "user", content: extractionPrompt },
          { role: "user", content: [{ type: "image", value: imageBitmap }] }
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
        console.error('Error processing image extraction or parsing JSON:', error);
      }
      return allExpenseOptions;
    } else {
      console.warn('Unsupported file type:', file.type);
      return Promise.resolve([]);
    }
  }
}
