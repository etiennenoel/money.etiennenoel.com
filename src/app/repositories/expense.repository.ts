import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Expense } from '../interfaces/expense.interface';
import { SearchQuery, SearchResult } from '@magieno/common';
import {CreateExpenseOptions} from '../options/create-expense.options';
import {IndexedDbClient, LoggingService} from '@magieno/angular-core';
import {EventStore} from '../stores/event.store';

const DB_NAME = 'trunk_track_expenses';
const STORE_NAME = 'expenses';

@Injectable({
  providedIn: 'root',
})
export class ExpenseRepository {
  constructor(
    private readonly indexedDbClient: IndexedDbClient<Expense>,
    private readonly eventStore: EventStore,
    ) {
  }

  async create(expenseData: CreateExpenseOptions): Promise<Expense> {
    const expense: Expense = {
      ...expenseData,
      transactionDate: expenseData.transactionDate,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    const createdExpense = await this.indexedDbClient.create(DB_NAME, STORE_NAME, expense);

    this.eventStore.expenseCreatedOrModified.next();
    return createdExpense;
  }

  async get(id: string): Promise<Expense | undefined> {
    return this.indexedDbClient.get(DB_NAME, STORE_NAME, id);
  }

  async list(): Promise<Expense[]> {
    return this.indexedDbClient.list(DB_NAME, STORE_NAME);
  }

  async update(expense: Expense): Promise<Expense> {
    const updatedExpense = await this.indexedDbClient.update(DB_NAME, STORE_NAME, expense);
    this.eventStore.expenseCreatedOrModified.next();
    return updatedExpense;
  }

  async delete(id: string): Promise<void> {
    await this.indexedDbClient.delete(DB_NAME, STORE_NAME, id);
    this.eventStore.expenseCreatedOrModified.next();
  }

  async search(searchQuery: SearchQuery): Promise<SearchResult<Expense>> {
    return this.indexedDbClient.search(DB_NAME, STORE_NAME, searchQuery);
  }
}
