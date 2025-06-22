import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Label } from '../interfaces/label.interface';
import {IndexedDbClient, LoggingService} from '@magieno/angular-core';
import {SearchQuery, SearchResult} from '@magieno/common';

const DB_NAME = 'trunk_track_labels';
const STORE_NAME = 'labels';

@Injectable({
  providedIn: 'root',
})
export class LabelRepository {
  constructor(
    private readonly indexedDbClient: IndexedDbClient<Label>
  ) {
  }

  async create(labelData: Omit<Label, 'id'>): Promise<Label> {
    const label: Label = {
      ...labelData,
      id: crypto.randomUUID(),
    };

    return this.indexedDbClient.create(DB_NAME, STORE_NAME, label);
  }

  async get(id: string): Promise<Label | undefined> {
    return this.indexedDbClient.get(DB_NAME, STORE_NAME, id);
  }

  async list(): Promise<Label[]> {
    return this.indexedDbClient.list(DB_NAME, STORE_NAME);
  }

  async update(label: Label): Promise<Label> {
    return this.indexedDbClient.update(DB_NAME, STORE_NAME, label);
  }

  async delete(id: string): Promise<void> {
    return this.indexedDbClient.delete(DB_NAME, STORE_NAME, id);
  }

  async search(searchQuery: SearchQuery): Promise<SearchResult<Label>> {
    return this.indexedDbClient.search(DB_NAME, STORE_NAME, searchQuery);
  }
}
