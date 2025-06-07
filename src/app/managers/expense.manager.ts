import { Injectable } from '@angular/core';
import { ExpenseRepository } from '../repositories/expense-repository';
import { Expense } from '../interfaces/expense.interface';

@Injectable({
  providedIn: 'root',
})
export class ExpenseManager {
  constructor(private expenseRepository: ExpenseRepository) {}

  async create(expenseData: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> {
    return this.expenseRepository.create(expenseData);
  }

  async getById(id: string): Promise<Expense | undefined> {
    return this.expenseRepository.getById(id);
  }

  async getAll(): Promise<Expense[]> {
    return this.expenseRepository.getAll();
  }

  async update(expense: Expense): Promise<Expense> {
    return this.expenseRepository.update(expense);
  }

  async delete(id: string): Promise<void> {
    return this.expenseRepository.delete(id);
  }
}
