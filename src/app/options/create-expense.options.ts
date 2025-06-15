import { advancedFormControl, FieldType , FormControlTypeEnum} from '@magieno/common';
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from '@pristine-ts/class-validator';
import {FormDate} from '@magieno/angular-advanced-forms';
import {CategoriesProvider} from '../providers/categories.provider';
import {LabelsProvider} from '../providers/labels.provider';

export class CreateExpenseOptions {
  @advancedFormControl({
    type: FormControlTypeEnum.Input,
    fieldType: FieldType.Money,
    displayableElements: {
      labelTitle: 'Amount',
    },
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  amount: number = 0;

  @advancedFormControl({
    type: FormControlTypeEnum.Input,
    fieldType: FieldType.Date,
    displayableElements: {
      labelTitle: 'Transaction Date',
    },
  })
  @IsNotEmpty()
  transactionDate!: FormDate;

  @advancedFormControl({
    type: FormControlTypeEnum.Input,
    fieldType: FieldType.String,
    displayableElements: {
      labelTitle: 'Location',
    },
  })
  @IsOptional()
  @IsString()
  location!: string;

  @advancedFormControl({
    type: FormControlTypeEnum.Input,
    fieldType: FieldType.String,
    displayableElements: {
      labelTitle: 'Description',
    },
  })
  @IsNotEmpty()
  @IsString()
  description!: string;

  @advancedFormControl({
    type: FormControlTypeEnum.MultiSelect,
    items: [{
      id: "bbq_id",
      label: "Barbecues"
    }],
    displayableElements: {
      labelTitle: 'Categories',
    },
  })
  @IsOptional()
  @IsArray()
  @IsString()
  categories!: string[];

  @advancedFormControl({
    type: FormControlTypeEnum.MultiSelect,
    itemsProviderToken: LabelsProvider,
    displayableElements: {
      labelTitle: 'Labels',
    },
  })
  @IsOptional()
  @IsArray()
  @IsString()
  labels!: string[];
}
