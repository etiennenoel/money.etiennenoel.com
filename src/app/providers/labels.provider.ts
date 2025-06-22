import {Injectable} from '@angular/core';
import {ItemInterface, ItemsProviderInterface, SearchQuery} from '@magieno/common';
import {CategoryRepository} from '../repositories/category.repository';
import {LabelRepository} from '../repositories/label.repository';

let items = [{
  id: "id_test",
  label: "Test"
}];

let a = 1;

@Injectable()
export class LabelsProvider implements ItemsProviderInterface {
  constructor(private readonly labelRepository: LabelRepository) {
  }

  async getItems(query?: string): Promise<ItemInterface[]> {
    const result = await this.labelRepository.search(new SearchQuery({
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
      throw new Error("Cannot create label from empty query.");
    }

    const label = await this.labelRepository.create({name: query});

    return {
      id: label.id,
      label: label.name
    }
  }
}
