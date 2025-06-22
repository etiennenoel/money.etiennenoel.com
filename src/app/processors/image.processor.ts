import {Injectable} from '@angular/core';
import {CreateExpenseOptions} from '../options/create-expense.options';
import {CreateExpenseOptionsJsonSchema} from '../json-schemas/create-expense-options.json-schema';
import {DataMapper} from '@pristine-ts/data-mapping-common';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessor {
  constructor(
    private readonly dataMapper: DataMapper,
  ) {
  }

  async extract(file: File): Promise<ImageBitmap> {
    if (!file.type.startsWith('image/')) {
      throw new Error(`File is not an image: ${file.type}`);
    }

    return createImageBitmap(file);
  }

  async extractCreateExpenseOptions(file: File): Promise<CreateExpenseOptions[]> {
    // @ts-expect-error
    const session = await LanguageModel.create({
      expectedInputs: [{type: "text"}, {type: "image"}],
      initialPrompts: [
        {
          role: "system",
          content: `You are a very advanced OCR tool. Transform any image into JSON by extracting all the expenses you find in the provided bank statements or receipts. Return an array of expenses containing these properties: 'transactionDate, amount, currency, description'. If a property is not applicable, you can omit it or set its value to null. Only identify expenses.`,
        }
      ]
    });
    const imageBitmap = await this.extract(file);

    const extractedDataString = await session.prompt([
      {role: "user", content: [{type: "image", value: imageBitmap}]}
    ], {responseConstraint: CreateExpenseOptionsJsonSchema});

    console.log(`Prompt response:`, extractedDataString);

    return this.dataMapper.autoMap(JSON.parse(extractedDataString), CreateExpenseOptions);
  }
}
