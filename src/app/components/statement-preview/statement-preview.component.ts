import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { PreviewData } from '../../importers/statement.importer'; // This now includes ImageBitmap types
import { CsvPreviewData } from '../../processors/csv.processor';

@Component({
  selector: 'app-statement-preview',
  standalone: false,
  templateUrl: './statement-preview.component.html',
  styleUrls: ['./statement-preview.component.scss']
})
export class StatementPreviewComponent implements OnChanges, AfterViewInit {
  @Input() previewData: PreviewData | null = null;

  isCsvData: boolean = false;
  csvHeaders: string[] = [];
  csvRows: Record<string, string>[] = [];
  imageBitmapsToRender: ImageBitmap[] = [];

  @ViewChildren('previewCanvas') previewCanvases!: QueryList<ElementRef<HTMLCanvasElement>>;

  private viewInitialized = false;

  public get showEmptyImageState(): boolean {
    return !this.isCsvData &&
           this.imageBitmapsToRender.length === 0 &&
           this.previewData !== null && // Ensure previewData is not null
           (this.previewData instanceof ImageBitmap || this.isImageBitmapArray(this.previewData));
  }

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['previewData']) { // Process if previewData input changes
      this.processPreviewData();
      if (this.viewInitialized && !this.isCsvData && this.imageBitmapsToRender.length > 0) {
        // Ensure drawing happens after data is processed and view is ready
        // Use a timeout to allow DOM to update with canvases from *ngFor
        setTimeout(() => this.drawImages(), 0);
      } else if (this.isCsvData || this.imageBitmapsToRender.length === 0) {
        // If data is CSV or no images to render, ensure canvases are not attempted to be drawn
        // (This can happen if previewData was previously images and now is CSV or null)
      }
    }
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    if (!this.isCsvData && this.imageBitmapsToRender.length > 0) {
      // Initial draw if data was already present
      setTimeout(() => this.drawImages(), 0);
    }
  }

  private processPreviewData(): void {
    this.resetData();
    if (!this.previewData) return;

    if (this.previewData instanceof ImageBitmap) {
      this.isCsvData = false;
      this.imageBitmapsToRender = [this.previewData];
    } else if (Array.isArray(this.previewData) && this.previewData.length > 0 && this.previewData[0] instanceof ImageBitmap) {
      this.isCsvData = false;
      this.imageBitmapsToRender = this.previewData as ImageBitmap[];
    } else if (this.isCsvPreviewData(this.previewData)) { // This check must be after ImageBitmap checks
      this.isCsvData = true;
      this.csvHeaders = (this.previewData as CsvPreviewData).headers; // Type assertion
      this.csvRows = (this.previewData as CsvPreviewData).rows;     // Type assertion
    }
    // Note: If previewData is an empty array, or not matching any type,
    // imageBitmapsToRender will be empty and isCsvData will be false due to resetData.
  }

  private isCsvPreviewData(data: PreviewData): data is CsvPreviewData {
    // Ensure it's not an ImageBitmap or array of ImageBitmap before checking CsvPreviewData structure
    if (data instanceof ImageBitmap || (Array.isArray(data) && data.length > 0 && data[0] instanceof ImageBitmap)) {
        return false;
    }
    // Check if it's not null and is an object (excluding arrays, which are handled above for ImageBitmap[])
    if (data === null || typeof data !== 'object' || Array.isArray(data)) {
        return false;
    }
    // Now, safely check for CsvPreviewData properties
    return 'headers' in data && 'rows' in data;
  }

  private resetData(): void {
    this.isCsvData = false;
    this.csvHeaders = [];
    this.csvRows = [];
    this.imageBitmapsToRender = [];
  }

  isImageBitmapArray(data: any): boolean { // Made public by removing 'private'
    if (Array.isArray(data) && data.length > 0) {
      return data.every(item => item instanceof ImageBitmap);
    }
    return false;
  }

  private drawImages(): void {
    if (!this.previewCanvases || this.previewCanvases.length !== this.imageBitmapsToRender.length) {
      console.warn('Preview canvases not ready or mismatch with image data. Attempting redraw shortly...');
      // This uses a timeout to wait for the QueryList to update after *ngFor has rendered the canvases.
      setTimeout(() => {
        if (this.viewInitialized && !this.isCsvData && this.imageBitmapsToRender.length > 0 &&
            this.previewCanvases.length === this.imageBitmapsToRender.length) {
            this.drawImagesInternal();
        } else if (this.previewCanvases.length !== this.imageBitmapsToRender.length) {
            console.error('Canvas and image data mismatch even after delay. Cannot draw images.');
        }
      }, 50); // A small delay, adjust if needed
      return;
    }
    this.drawImagesInternal();
  }

  private drawImagesInternal(): void {
    if (!this.previewCanvases) return; // Guard against undefined QueryList

    this.previewCanvases.forEach((canvasRef, index) => {
      const bitmap = this.imageBitmapsToRender[index];
      if (bitmap && canvasRef && canvasRef.nativeElement) { // Added null check for nativeElement
        const canvas = canvasRef.nativeElement;
        canvas.width = 768;
        canvas.height = 768;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(bitmap, 0, 0, 768, 768);
        } else {
          console.error('Failed to get 2D context for canvas at index ' + index);
        }
      }
    });
  }
}
