import {Injectable} from '@angular/core';
import {ItemInterface, ItemsProviderInterface} from '@magieno/common';

@Injectable()
export class CategoriesProvider implements ItemsProviderInterface {
    async getItems(query?: string): Promise<ItemInterface[]> {
      console.log("CategoriesProvider")
        return [];
    }
}
