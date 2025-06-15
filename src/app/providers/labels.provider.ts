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

  async createFrom(query?: string): Promise<ItemInterface> {
    console.log("Create From");
    a++;

   return new Promise(resolve => {
     let item = {
       id: a + "",
       label: query + "_",
     }

     items.push(item)

     setTimeout(() => {
       resolve(item);
     }, 1000)
   })


  }
}
