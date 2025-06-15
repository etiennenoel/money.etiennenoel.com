import {Injectable} from '@angular/core';
import {ItemInterface, ItemsProviderInterface} from '@magieno/common';
import {CategoryRepository} from '../repositories/category.repository';

@Injectable()
export class CategoriesProvider implements ItemsProviderInterface {
  constructor(private readonly categoryRepository: CategoryRepository) {
  }

  async getItems(query?: string): Promise<ItemInterface[]> {
    const categories = await this.categoryRepository.getAll();

    return categories.map(category => {
      return {
        id: category.id,
        label: category.name
      }
    })
  }

  async createFrom(query?: string): Promise<ItemInterface> {
    if(!query) {
      throw new Error("Cannot create category from empty query.");
    }

    const category = await this.categoryRepository.create({name: query ?? ""});

    return {
      id: category.id,
      label: category.name
    }
  }
}
