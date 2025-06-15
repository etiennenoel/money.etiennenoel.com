// Import types and getDocument from pdf.js.
// Note: The exact import path might vary depending on how pdf.js is installed/imported.
// For example, if using a global script, it might be via `window['pdfjs-dist/build/pdf']`.
// We'll assume it's available as an ES module import for this example.
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
// If using workerSrc:
// pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';


export class PdfProcessor {
  constructor() {
    // It's good practice to set the workerSrc for pdf.js, especially for larger PDFs.
    // This would typically be a path to the pdf.worker.js file hosted with your application
    // or from a CDN. For this example, we'll comment it out but it's important for real usage.
    // If you are managing dependencies yourself, ensure 'pdf.worker.js' is accessible.
    // Example:
    // if (typeof window !== 'undefined' && 'pdfjsLib' in window) {
    //   (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${(window as any).pdfjsLib.version}/pdf.worker.min.js`;
    // }
  }

  async convertToImages(pdfFile: File): Promise<string[]> {
    console.log('convertToImages (with pdf.js) called for:', pdfFile.name);
    const images: string[] = [];
    const arrayBuffer = await pdfFile.arrayBuffer();

    try {
      // Load the PDF document using pdf.js
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;

      console.log(`PDF loaded with ${numPages} pages.`);

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 }); // Use desired scale

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
        images.push(canvas.toDataURL('image/png')); // Or 'image/jpeg'
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
}
