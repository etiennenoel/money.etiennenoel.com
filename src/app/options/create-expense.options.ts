import { advancedFormControl, FieldType } from '@magieno/common';
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from '@pristine-ts/class-validator';
import {FormDate} from '@magieno/angular-advanced-forms';

export class CreateExpenseOptions {
  @advancedFormControl({
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
    fieldType: FieldType.Date,
    displayableElements: {
      labelTitle: 'Transaction Date',
    },
  })
  @IsNotEmpty()
  transactionDate!: FormDate;

  @advancedFormControl({
    fieldType: FieldType.String,
    displayableElements: {
      labelTitle: 'Location',
    },
  })
  @IsOptional()
  @IsString()
  location!: string;

  @advancedFormControl({
    fieldType: FieldType.String,
    displayableElements: {
      labelTitle: 'Description',
    },
  })
  @IsNotEmpty()
  @IsString()
  description!: string;

  @advancedFormControl({
    fieldType: FieldType.String,
    displayableElements: {
      labelTitle: 'Categories',
    },
  })
  @IsOptional()
  @IsArray()
  @IsString()
  categories!: string[];

  @advancedFormControl({
    fieldType: FieldType.String,
    displayableElements: {
      labelTitle: 'Labels',
    },
  })
  @IsOptional()
  @IsArray()
  @IsString()
  labels!: string[];
}
