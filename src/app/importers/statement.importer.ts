import { CreateExpenseOptions } from '../options/create-expense.options';
import { Injectable } from '@angular/core';
import { CsvProcessorService } from '../services/csv.processor';
import { PdfProcessor } from '../services/pdf.processor';
import { PromptService } from '../services/prompt.service';

@Injectable({
  providedIn: 'root'
})
export class StatementImporter {
  constructor(
    private csvProcessor: CsvProcessorService,
    private pdfProcessor: PdfProcessor,
    private promptService: PromptService
  ) {}

  async process(file: File): Promise<CreateExpenseOptions[]> {
    console.log('Processing file in StatementImporter:', file.name);

    if (file.type === 'text/csv') {
      const records = await this.csvProcessor.processCsv(file);
      if (!records || records.length === 0) {
        return [];
      }

      const headers = Object.keys(records[0]);
      const properties = Object.keys(new CreateExpenseOptions());

      const mappingPrompt = `Given the CSV headers: ${headers.join(', ')}, map them to the following properties: ${properties.join(', ')}. Provide the mapping as a JSON object where keys are CSV headers and values are property names.`;
      const mappingConfig = await this.promptService.prompt(mappingPrompt);

      let parsedMapping: Record<string, string>;
      try {
        parsedMapping = JSON.parse(mappingConfig);
      } catch (error) {
        console.error('Error parsing mapping configuration:', error);
        // Handle error or provide a default mapping
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

      const properties = Object.keys(new CreateExpenseOptions());

      for (const image of images) {
        // It's assumed that `image` here is a representation that can be used in a prompt,
        // e.g., a URL or a base64 string. For this example, let's assume it's a URL or identifier.
        // The actual image data/URL would need to be passed to the prompt if the LLM can process images.
        // If not, the prompt needs to be very descriptive about what the user should do with the image they see elsewhere.
        const extractionPrompt = `Extract expense data from the provided image (represented by: ${image}). Please provide the data as a JSON object with the following properties: ${properties.join(', ')}. If a property is not applicable, you can omit it or set its value to null.`;

        try {
          const extractedDataString = await this.promptService.prompt(extractionPrompt);
          if (extractedDataString) {
            const parsedData = JSON.parse(extractedDataString);
            // We might get a single expense object or an array of them
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
          // Optionally, continue to the next image or handle the error appropriately
        }
      }
      return allExpenseOptions;
    } else {
      console.warn('Unsupported file type:', file.type);
      return Promise.resolve([]);
    }
  }
}
