import { Component, OnInit, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Expense } from '../../interfaces/expense.interface';
import { ExpenseRepository } from '../../repositories/expense-repository';
import { MOCK_EXPENSES } from '../../stores/mock-expenses';
import { Injector } from '@angular/core'; // Import Injector

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.page.html',
  styleUrl: './expense-list.page.scss',
  standalone: false,
})
export class ExpenseListPage implements OnInit {
  public allExpenses: Expense[] = []; // Stores all expenses
  public expenses: Expense[] = []; // Stores filtered and sorted expenses for display
  public searchTerm: string = '';
  public currentSortColumn: keyof Expense | '' = 'transactionDate';
  public isSortAscending: boolean = false;
  private expenseRepository?: ExpenseRepository;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private injector: Injector // Inject Injector
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.expenseRepository = this.injector.get(ExpenseRepository);
    }
  }

  async ngOnInit(): Promise<void> {
    if (this.expenseRepository) {
      // In a real app, this would be an async call
      this.allExpenses = await this.expenseRepository.getAll(); // Load all data
    } else {
      // Fallback for SSR or if repository not available
      this.allExpenses = MOCK_EXPENSES;
      console.warn('ExpenseRepository not available, using mock data.');
    }
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
      // @ts-ignore
      const valA = a[this.currentSortColumn!];
      // @ts-ignore
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
