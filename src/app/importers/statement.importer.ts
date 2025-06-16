import { CreateExpenseOptions } from '../options/create-expense.options';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatementImporter {
  constructor() {}

  async process(file: File): Promise<CreateExpenseOptions[]> {
    // For now, return a promise that resolves to an empty array.
    // Add a console.log to show the file name for now.
    console.log('Processing file in StatementImporter:', file.name);
    return Promise.resolve([]);
  }
}
