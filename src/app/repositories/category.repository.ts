import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Category } from '../interfaces/category.interface';
import {LoggingService} from '@magieno/angular-core';

const DB_NAME = 'trunk_track';
const STORE_NAME = 'categories';

@Injectable({
  providedIn: 'root',
})
export class CategoryRepository {
  private dbPromise: Promise<IDBDatabase | null>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly loggingService: LoggingService,
    ) {
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
          this.loggingService.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
          reject((event.target as IDBOpenDBRequest).error);
        };
      });
    } else {
      this.dbPromise = Promise.resolve(null);
    }
  }

  async create(categoryData: Omit<Category, 'id'>): Promise<Category> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.reject(new Error('IndexedDB is not available in this environment.'));
    }
    const db = await this.dbPromise;
    if (!db) {
      return Promise.reject(new Error('IndexedDB is not available.'));
    }

    const category: Category = {
      ...categoryData,
      id: crypto.randomUUID(),
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(category);

      request.onsuccess = () => {
        resolve(category);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }

  async getById(id: string): Promise<Category | undefined> {
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
        resolve((event.target as IDBRequest).result as Category | undefined);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }

  async getAll(): Promise<Category[]> {
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
        resolve((event.target as IDBRequest).result as Category[]);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }

  async update(category: Category): Promise<Category> {
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
      const getRequest = store.get(category.id);

      getRequest.onsuccess = (event) => {
        if (!(event.target as IDBRequest).result) {
          return reject(new Error(`Category with id ${category.id} not found.`));
        }
        const putRequest = store.put(category);
        putRequest.onsuccess = () => {
          resolve(category);
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
