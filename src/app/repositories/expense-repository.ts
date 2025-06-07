import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Expense } from '../interfaces/expense.interface';

const DB_NAME = 'ExpenseDB';
const STORE_NAME = 'expenses';

@Injectable({
  providedIn: 'root',
})
export class ExpenseRepository {
  private dbPromise: Promise<IDBDatabase | null>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        };

        request.onsuccess = (event) => {
          resolve((event.target as IDBOpenDBRequest).result);
        };

        request.onerror = (event) => {
          console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
          reject((event.target as IDBOpenDBRequest).error);
        };
      });
    } else {
      // In a non-browser environment, resolve dbPromise to null.
      // Operations will then gracefully fail or return default values.
      this.dbPromise = Promise.resolve(null);
    }
  }

  async create(expenseData: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.reject(new Error('IndexedDB is not available in this environment.'));
    }
    const db = await this.dbPromise;
    if (!db) {
      return Promise.reject(new Error('IndexedDB is not available.'));
    }

    const expense: Expense = {
      ...expenseData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(expense);

      request.onsuccess = () => {
        resolve(expense);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }

  async getById(id: string): Promise<Expense | undefined> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve(undefined);
    }
    const db = await this.dbPromise;
    if (!db) {
      return Promise.resolve(undefined);
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result as Expense | undefined);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }

  async getAll(): Promise<Expense[]> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve([]);
    }
    const db = await this.dbPromise;
    if (!db) {
      return Promise.resolve([]);
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result as Expense[]);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }

  async update(expense: Expense): Promise<Expense> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.reject(new Error('IndexedDB is not available in this environment.'));
    }
    const db = await this.dbPromise;
    if (!db) {
      return Promise.reject(new Error('IndexedDB is not available.'));
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(expense.id);

      getRequest.onsuccess = (event) => {
        if (!(event.target as IDBRequest).result) {
          return reject(new Error(`Expense with id ${expense.id} not found.`));
        }
        const putRequest = store.put(expense);
        putRequest.onsuccess = () => {
          resolve(expense);
        };
        putRequest.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
      };
      getRequest.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }

  async delete(id: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve();
    }
    const db = await this.dbPromise;
    if (!db) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }
}
