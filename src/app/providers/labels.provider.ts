import {Injectable} from '@angular/core';
import {ItemInterface, ItemsProviderInterface} from '@magieno/common';

let items = [{
  id: "id_test",
  label: "Test"
}];

let a = 1;

@Injectable()
export class LabelsProvider implements ItemsProviderInterface {
    async getItems(query?: string): Promise<ItemInterface[]> {
        return items.filter(items => items.label.includes(query ?? ""));
    }

  async createFrom(query?: string): Promise<void> {
      console.log("Create From");
      a++;

      items.push({
        id: a+"",
        label: query+"_",
      })
  }
}
