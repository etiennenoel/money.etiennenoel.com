import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Category } from '../interfaces/category.interface';
import {IndexedDbClient, LoggingService} from '@magieno/angular-core';
import {SearchQuery, SearchResult} from '@magieno/common';

const DB_NAME = 'trunk_track_categories';
const STORE_NAME = 'categories';

@Injectable({
  providedIn: 'root',
})
export class CategoryRepository {
  constructor(
    private readonly indexedDbClient: IndexedDbClient<Category>
  ) {
  }

  async create(categoryData: Omit<Category, 'id'>): Promise<Category> {
    const category: Category = {
      ...categoryData,
      id: crypto.randomUUID(),
    };

    return this.indexedDbClient.create(DB_NAME, STORE_NAME, category);
  }

  async get(id: string): Promise<Category | undefined> {
    return this.indexedDbClient.get(DB_NAME, STORE_NAME, id);
  }

  async list(): Promise<Category[]> {
    return this.indexedDbClient.list(DB_NAME, STORE_NAME);
  }

  async update(category: Category): Promise<Category> {
    return this.indexedDbClient.update(DB_NAME, STORE_NAME, category);
  }

  async delete(id: string): Promise<void> {
    return this.indexedDbClient.delete(DB_NAME, STORE_NAME, id);
  }

  async search(searchQuery: SearchQuery): Promise<SearchResult<Category>> {
    return this.indexedDbClient.search(DB_NAME, STORE_NAME, searchQuery);
  }
}
