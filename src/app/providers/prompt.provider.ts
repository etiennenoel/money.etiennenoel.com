import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {AdvancedFormControl} from '@magieno/angular-advanced-forms';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {isPlatformServer} from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PromptProvider {

  imageExtractionSystemPromptFormControl = new FormControl<string>(this.getImageExtractionSystemPrompt());

  subscriptions: Subscription[] = [];

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
  ) {
    if(isPlatformServer(this.platformId)) {
      return;
    }

    this.subscriptions.push(this.imageExtractionSystemPromptFormControl.valueChanges.subscribe(value => {
      if(value === null) {
        localStorage.removeItem("image_extraction_prompt_override");
        return;
      }

      localStorage.setItem("image_extraction_prompt_override", value);
    }))
  }

  getImageExtractionSystemPrompt() {
    if(isPlatformServer(this.platformId)) {
      return "";
    }

    const promptOverride = window.localStorage.getItem("image_extraction_system_prompt_override");
    if(promptOverride) {
      return promptOverride;
    } else {
      return `You are a very advanced OCR tool. Transform any image into JSON by extracting all the expenses you find in the provided bank statements or receipts. Return an array of expenses containing these properties: 'transactionDate, amount, currency, description'. If a property is not applicable, you can omit it or set its value to null. Only identify expenses.`;
    }
  }



}
