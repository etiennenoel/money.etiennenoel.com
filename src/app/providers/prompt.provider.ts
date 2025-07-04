import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {AdvancedFormControl} from '@magieno/angular-advanced-forms';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {DOCUMENT, isPlatformServer} from '@angular/common';
import {CreateExpenseOptionsJsonSchema} from '../json-schemas/create-expense-options.json-schema';
import {LoggingService} from '@magieno/angular-core';

@Injectable({
  providedIn: 'root',
})
export class PromptProvider {

  imageExtractionUserPromptFormControl!: FormControl<string | null>;
  imageExtractionSystemPromptFormControl!: FormControl<string | null>;
  imageExtractionJSONSchemaFormControl!: FormControl<string | null>;

  subscriptions: Subscription[] = [];

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
    if(isPlatformServer(this.platformId)) {
      return;
    }

    this.imageExtractionUserPromptFormControl = new FormControl<string>(this.getImageExtractionUserPrompt());
    this.imageExtractionSystemPromptFormControl = new FormControl<string>(this.getImageExtractionSystemPrompt());
    this.imageExtractionJSONSchemaFormControl = new FormControl<string>(this.getImageExtractionJSONSchema());

    this.subscriptions.push(this.imageExtractionSystemPromptFormControl.valueChanges.subscribe(value => {
      if(value === null) {
        localStorage.removeItem("image_extraction_system_prompt_override");
        return;
      }

      localStorage.setItem("image_extraction_system_prompt_override", value);
    }))

    this.subscriptions.push(this.imageExtractionUserPromptFormControl.valueChanges.subscribe(value => {
      if(value === null) {
        localStorage.removeItem("image_extraction_user_prompt_override");
        return;
      }

      localStorage.setItem("image_extraction_user_prompt_override", value);
    }))

    this.subscriptions.push(this.imageExtractionJSONSchemaFormControl.valueChanges.subscribe(value => {
      if(value === null) {
        localStorage.removeItem("image_extraction_json_schema_override");
        return;
      }

      localStorage.setItem("image_extraction_json_schema_override", value);
    }))
  }

  getImageExtractionSystemPrompt() {
    if(isPlatformServer(this.platformId)) {
      return "";
    }

    const promptOverride = this.document.defaultView?.localStorage.getItem("image_extraction_system_prompt_override");
    if(promptOverride) {
      return promptOverride;
    } else {
      return `You are a very advanced OCR tool. Transform any image into JSON by extracting all the expenses you find in the provided bank statements or receipts. Return an array of expenses containing these properties: 'transactionDate, amount, description'. If a property is not applicable, you can omit it or set its value to null. Only identify expenses.`;
    }
  }

  getImageExtractionUserPrompt() {
    if(isPlatformServer(this.platformId)) {
      return "";
    }

    const promptOverride = this.document.defaultView?.localStorage.getItem("image_extraction_user_prompt_override");
    if(promptOverride) {
      return promptOverride;
    } else {
      return `Extract the expenses from this image.`;
    }
  }

  getImageExtractionJSONSchema() {
    if(isPlatformServer(this.platformId)) {
      return "";
    }

    const jsonSchema = this.document.defaultView?.localStorage.getItem("image_extraction_json_schema_override");
    if(jsonSchema) {
      return jsonSchema;
    } else {
      return JSON.stringify(CreateExpenseOptionsJsonSchema, undefined, 2);
    }
  }
}
