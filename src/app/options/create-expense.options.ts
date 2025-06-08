import {advancedFormControl, FieldType} from '@magieno/common';

export class CreateExpenseOptions {
  @advancedFormControl({
    fieldType: FieldType.Money,
    displayableElements: {
       labelTitle: "Amount",
    },
  })
  amount: number = 0;
}
