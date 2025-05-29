import { Component, OnInit } from '@angular/core';
import { Expense } from '../../interfaces/expense.interface';
import { ExpenseRepository } from '../../stores/expense-repository';
import { MOCK_EXPENSES } from '../../stores/mock-expenses';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.scss'
})
export class ExpenseList implements OnInit {
  public allExpenses: Expense[] = []; // Stores all expenses
  public expenses: Expense[] = []; // Stores filtered and sorted expenses for display
  public searchTerm: string = '';
  public currentSortColumn: keyof Expense | '' = 'transactionDate';
  public isSortAscending: boolean = false;

  constructor(private expenseRepository: ExpenseRepository) { }

  ngOnInit(): void {
    // In a real app, this would be an async call
    this.allExpenses = MOCK_EXPENSES; // Load all data
    this.applyFilters(); // Apply initial filters (none) and sorting
    console.log('Expenses after initial load, filter, and sort:', this.expenses);
  }

  applyFilters(): void {
    const term = this.searchTerm.toLowerCase();
    this.expenses = this.allExpenses.filter(expense => {
      if (!term) return true; // No search term, include all

      return (
        expense.id.toLowerCase().includes(term) ||
        expense.location.toLowerCase().includes(term) ||
        expense.description.toLowerCase().includes(term) ||
        expense.currency.toLowerCase().includes(term) ||
        (expense.categories && expense.categories.some(cat => cat.toLowerCase().includes(term))) ||
        (expense.labels && expense.labels.some(label => label.toLowerCase().includes(term)))
      );
    });
    this.sortExpenses(); // Re-apply sorting after filtering
  }

  sortByColumn(columnName: keyof Expense): void {
    if (this.currentSortColumn === columnName) {
      this.isSortAscending = !this.isSortAscending;
    } else {
      this.currentSortColumn = columnName;
      this.isSortAscending = true; // Default to ascending for new column
    }
    this.sortExpenses(); // Sorts the currently displayed (filtered) expenses
    console.log(`Sorted by ${columnName}, ascending: ${this.isSortAscending}`, this.expenses);
  }

  private sortExpenses(): void {
    // Ensure it sorts this.expenses, not this.allExpenses
    if (!this.currentSortColumn || !this.expenses) return;

    this.expenses.sort((a, b) => {
      const valA = a[this.currentSortColumn!];
      const valB = b[this.currentSortColumn!];
      let comparison = 0;

      if (this.currentSortColumn === 'transactionDate' || this.currentSortColumn === 'createdAt') {
        comparison = new Date(valA as Date).getTime() - new Date(valB as Date).getTime();
      } else if (this.currentSortColumn === 'amount') {
        comparison = (valA as number) - (valB as number);
      } else if (Array.isArray(valA) && Array.isArray(valB)) {
        comparison = (valA as string[]).length - (valB as string[]).length;
        if (comparison === 0) { // Secondary sort for arrays if lengths are equal
          comparison = (valA as string[]).join(',').localeCompare((valB as string[]).join(','));
        }
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        comparison = (valA as string).localeCompare(valB as string);
      }
      return this.isSortAscending ? comparison : comparison * -1;
    });
  }
}
