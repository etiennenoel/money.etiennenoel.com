import { Injectable } from '@angular/core';
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/legacy/build/pdf.mjs";
import {DataMapper} from '@pristine-ts/data-mapping-common';
import {CreateExpenseOptions} from '../options/create-expense.options';
import {CreateExpenseOptionsJsonSchema} from '../json-schemas/create-expense-options.json-schema';

GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs'; // Or your local path

@Injectable({
  providedIn: 'root'
})
export class PdfProcessor {
  constructor(
    private readonly dataMapper: DataMapper,
  ) {
  }

  async extract(pdfFile: File): Promise<ImageBitmap[]> {
    console.log('convertToImages (with pdf.js) called for:', pdfFile.name);
    const images: ImageBitmap[] = [];

    const arrayBuffer = await pdfFile.arrayBuffer();

    try {
      // Load the PDF document using pdf.js
      const loadingTask = getDocument({ data: arrayBuffer });
      const pdfDoc: PDFDocumentProxy = await loadingTask.promise; // Added type for clarity
      const numPages = pdfDoc.numPages;

      console.log(`PDF loaded with ${numPages} pages.`);

      for (let i = 1; i <= numPages; i++) {
        const page: PDFPageProxy = await pdfDoc.getPage(i); // Added type for clarity
        const viewport = page.getViewport({ scale: 1 }); // Use desired scale

        // Create a canvas element
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Could not get canvas context');
        }

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render the page onto the canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await page.render(renderContext).promise;

        // Add the image data URL to the array
        images.push(await createImageBitmap(canvas)); // Or 'image/jpeg'
        console.log(`Rendered page ${i}/${numPages} to image.`);

        // Clean up page resources
        page.cleanup();
      }
      return images;
    } catch (error) {
      console.error('Error processing PDF with pdf.js:', error);
      // Depending on requirements, either re-throw or return empty/partial results
      return []; // Return empty array on error
    }
  }

  async extractCreateExpenseOptions(file: File): Promise<CreateExpenseOptions[]> {
    const images = await this.extract(file);

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

    const extractedDataString = await session.prompt([
      {
        role: "user",
        content:
          images.map(image => {
            return {
              type: "image",
              value: image
            }
        })
      }], {responseConstraint: CreateExpenseOptionsJsonSchema});

    return this.dataMapper.autoMap(JSON.parse(extractedDataString), CreateExpenseOptions);
  }
}
