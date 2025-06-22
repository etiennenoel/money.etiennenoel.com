import {Injectable} from '@angular/core';
import {CreateExpenseOptions} from '../options/create-expense.options';
import {CreateExpenseOptionsJsonSchema} from '../json-schemas/create-expense-options.json-schema';
import {DataMapper} from '@pristine-ts/data-mapping-common';
import {LoggingService} from '@magieno/angular-core';
import {PromptProvider} from '../providers/prompt.provider';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessor {
  constructor(
    private readonly dataMapper: DataMapper,
    private readonly loggingService: LoggingService,
    private readonly promptProvider: PromptProvider,
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
          content: this.promptProvider.getImageExtractionSystemPrompt(),
        }
      ]
    });
    const imageBitmap = await this.extract(file);

    const jsonSchema = JSON.parse(this.promptProvider.getImageExtractionJSONSchema());

    const extractedDataString = await session.prompt([
      {role: "user", content: [{type: "image", value: imageBitmap}]}
    ], {responseConstraint: jsonSchema});

    this.loggingService.debug(`Prompt response:`, extractedDataString);

    return this.dataMapper.autoMap(JSON.parse(extractedDataString), CreateExpenseOptions);
  }
}
