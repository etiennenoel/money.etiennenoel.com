import {Injectable} from '@angular/core';
import {ItemInterface, ItemsProviderInterface, SearchQuery} from '@magieno/common';
import {CategoryRepository} from '../repositories/category.repository';

@Injectable()
export class CategoriesProvider implements ItemsProviderInterface {
  constructor(private readonly categoryRepository: CategoryRepository) {
  }

  async getItems(query?: string): Promise<ItemInterface[]> {
    const result = await this.categoryRepository.search(new SearchQuery({
      query,
    }));

    return result.results.map(element => {
      return {
        id: element.id,
        label: element.name
      }
    })
  }

  async createFrom(query?: string): Promise<ItemInterface> {
    if(!query) {
      throw new Error("Cannot create category from empty query.");
    }

    const category = await this.categoryRepository.create({name: query});

    return {
      id: category.id,
      label: category.name
    }
  }
}
