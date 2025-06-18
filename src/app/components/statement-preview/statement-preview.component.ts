import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core'; // QueryList removed, ViewChild added
import { PreviewData } from '../../importers/statement.importer';
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

  // Pagination properties
  public currentPageIndex: number = 0;
  public totalPages: number = 0;

  @ViewChild('previewCanvas') previewCanvas!: ElementRef<HTMLCanvasElement>; // Changed to ViewChild for a single canvas

  private viewInitialized = false;

  public get showEmptyImageState(): boolean {
    return !this.isCsvData &&
           this.imageBitmapsToRender.length === 0 &&
           this.previewData !== null &&
           (this.previewData instanceof ImageBitmap || this.isImageBitmapArray(this.previewData));
  }

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['previewData']) {
      this.processPreviewData();
      if (this.viewInitialized && !this.isCsvData && this.imageBitmapsToRender.length > 0) {
        setTimeout(() => this.drawCurrentImage(), 0);
      }
    }
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    if (!this.isCsvData && this.imageBitmapsToRender.length > 0) {
      setTimeout(() => this.drawCurrentImage(), 0);
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
    } else if (this.isCsvPreviewData(this.previewData)) {
      this.isCsvData = true;
      this.csvHeaders = (this.previewData as CsvPreviewData).headers;
      this.csvRows = (this.previewData as CsvPreviewData).rows;
    }

    this.totalPages = this.imageBitmapsToRender.length; // Calculate total pages
    this.currentPageIndex = 0; // Reset current page
  }

  private isCsvPreviewData(data: PreviewData): data is CsvPreviewData {
    if (data instanceof ImageBitmap || (Array.isArray(data) && data.length > 0 && data[0] instanceof ImageBitmap)) {
        return false;
    }
    if (data === null || typeof data !== 'object' || Array.isArray(data)) {
        return false;
    }
    return 'headers' in data && 'rows' in data;
  }

  private resetData(): void {
    this.isCsvData = false;
    this.csvHeaders = [];
    this.csvRows = [];
    this.imageBitmapsToRender = [];
    this.totalPages = 0; // Reset total pages
    this.currentPageIndex = 0; // Reset current page
  }

  isImageBitmapArray(data: any): boolean {
    if (Array.isArray(data) && data.length > 0) {
      return data.every(item => item instanceof ImageBitmap);
    }
    return false;
  }

  // Method to draw the current image
  private drawCurrentImage(): void {
    if (!this.previewCanvas || !this.previewCanvas.nativeElement) {
      console.warn('Preview canvas not ready. Attempting redraw shortly...');
      setTimeout(() => {
        if (this.viewInitialized && this.previewCanvas && this.previewCanvas.nativeElement) {
            this.drawCurrentImageInternal();
        } else {
            console.error('Canvas not ready even after delay. Cannot draw image.');
        }
      }, 50);
      return;
    }
    this.drawCurrentImageInternal();
  }

  private drawCurrentImageInternal(): void {
    if (!this.previewCanvas || !this.previewCanvas.nativeElement || this.imageBitmapsToRender.length === 0) {
        // Clear canvas if no images or canvas not ready
        if (this.previewCanvas && this.previewCanvas.nativeElement) {
            const canvas = this.previewCanvas.nativeElement;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        return;
    }

    const bitmap = this.imageBitmapsToRender[this.currentPageIndex];
    if (bitmap) {
      const canvas = this.previewCanvas.nativeElement;
      canvas.width = 768; // Consider making these configurable or dynamic
      canvas.height = 768;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear before drawing
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      } else {
        console.error('Failed to get 2D context for canvas.');
      }
    }
  }

  // Navigation methods
  public nextPage(): void {
    if (this.currentPageIndex < this.totalPages - 1) {
      this.currentPageIndex++;
      this.drawCurrentImage();
    }
  }

  public previousPage(): void {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
      this.drawCurrentImage();
    }
  }
}
