import { Component, Input } from '@angular/core';
import { CreateExpenseOptions } from '../../../options/create-expense.options';

@Component({
  selector: 'app-expense-import-table',
  standalone: false,
  templateUrl: './expense-import-table.html',
  styleUrl: './expense-import-table.scss'
})
export class ExpenseImportTable {
  @Input() expenseOptions: CreateExpenseOptions[] = [];

  addExpenseOption(): void {
    this.expenseOptions.push(new CreateExpenseOptions());
  }

  deleteExpenseOption(index: number): void {
    if (index >= 0 && index < this.expenseOptions.length) {
      this.expenseOptions.splice(index, 1);
    }
  }
}
