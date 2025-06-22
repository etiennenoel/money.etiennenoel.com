import { Injectable } from '@angular/core';
import {CsvPreviewData} from '../interfaces/csv-preview-data.interface';
import {CreateExpenseOptions} from '../options/create-expense.options';
import {DataMapper} from '@pristine-ts/data-mapping-common';
import {CreateExpenseOptionsJsonSchema} from '../json-schemas/create-expense-options.json-schema';
import {LoggingService} from '@magieno/angular-core';

@Injectable({
  providedIn: 'root'
})
export class CsvProcessor {
  constructor(
    private readonly loggingService: LoggingService
  ) { }

  async extract(file: File): Promise<CsvPreviewData> {
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

  private getJsonSchema(headers: string[]) {
    const jsonSchema: any = {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Expenses",
      "description": "An array of expenses",
      "type": "array",
      "items": {
        "type": "object",
        "title": "Expense",
        "description": "A single expense record",
        "required": headers,
        "properties": {
        }
      }
    }

    // Map the headers into properties object
    headers.forEach(header => {
      jsonSchema.items.properties[header] = {
        "type": "string"
      }
    })

    return jsonSchema;
  }

  async extractCreateExpenseOptions(file: File): Promise<CreateExpenseOptions[]> {
    const csvResult = await this.extract(file); // Use the new method
    if (!csvResult || csvResult.rows.length === 0) return [];

    const headersForPrompt = csvResult.headers; // Use headers directly
    const recordsToMap = csvResult.rows;      // Use rows for mapping

    // @ts-expect-error
    const session = await LanguageModel.create({
      expectedInputs: [{type: "text"}],
      initialPrompts: [
        {
          role: "system",
          content: `You are a very advanced CSV mapping tool. You will received CSV headers and will map them to the following properties: 'transactionDate, amount, currency, description'. Provide the mapping as a JSON object where keys are CSV headers and values are property names.`,
        }
      ]
    });

    const mappingConfig = await session.prompt(`Given the CSV headers: ${headersForPrompt.join(', ')}, map them.`, {
      responseConstraint: this.getJsonSchema(headersForPrompt),
    });

    this.loggingService.debug(`Prompt response:`, mappingConfig);

    let parsedMapping: Record<string, string> = JSON.parse(mappingConfig);

    return recordsToMap.map(record => { // Map over csvResult.rows
      const expenseOptions = new CreateExpenseOptions();
      for (const header in parsedMapping) {
        if (record.hasOwnProperty(header) && expenseOptions.hasOwnProperty(parsedMapping[header])) {
          (expenseOptions as any)[parsedMapping[header]] = record[header];
        }
      }
      return expenseOptions;
    });
  }
}
