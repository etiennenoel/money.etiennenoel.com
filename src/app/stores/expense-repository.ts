import { Expense } from '../interfaces/expense.interface';

const DB_NAME = 'ExpenseDB';
const STORE_NAME = 'expenses';

export class ExpenseRepository {
  private dbPromise: Promise<IDBDatabase>;

  constructor() {
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
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  async create(expenseData: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> {
    const db = await this.dbPromise;
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
    const db = await this.dbPromise;
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
    const db = await this.dbPromise;
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
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      // Ensure the ID exists before attempting to update
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
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
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
