import { advancedFormControl, FieldType } from '@magieno/common';
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateExpenseOptions {
  @advancedFormControl({
    fieldType: FieldType.Money,
    displayableElements: {
      labelTitle: 'Amount',
    },
  })
  @IsNotEmpty({ message: 'Amount is required.' }) // Matching HTML
  @IsNumber({}, { message: 'Amount must be a number.' }) // General validation
  @Min(0.01, { message: 'Amount must be greater than 0.' }) // Matching HTML
  amount: number = 0;

  @IsNotEmpty({ message: 'Transaction date is required.' }) // Matching HTML
  @IsDate({ message: 'Transaction date must be a valid date.' })
  transactionDate!: Date; // Using definite assignment assertion for now, validators will ensure it's populated.

  @IsOptional()
  @IsString({ message: 'Location must be a string.' })
  location!: string;

  @IsNotEmpty({ message: 'Description is required.' }) // Matching HTML
  @IsString({ message: 'Description must be a string.' })
  description!: string;

  @IsOptional()
  @IsArray({ message: 'Categories must be an array.' })
  @IsString({ each: true, message: 'Each category must be a string.' })
  categories!: string[];

  @IsOptional()
  @IsArray({ message: 'Labels must be an array.' })
  @IsString({ each: true, message: 'Each label must be a string.' })
  labels!: string[];
}
