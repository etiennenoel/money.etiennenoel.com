import {advancedFormControl, FieldType, translationBaseKey} from '@magieno/common';

@translationBaseKey("create-expense.options")
export class CreateExpenseOptions {
  @advancedFormControl({
    fieldType: FieldType.Money,
    labelTitle: {
      en: "Amount",
    },
  })
  amount: number = 0;
}
