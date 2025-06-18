import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PreviewData } from '../../importers/statement.importer';
import { CsvPreviewData } from '../../processors/csv.processor';

@Component({
  selector: 'app-statement-preview',
  templateUrl: './statement-preview.component.html',
  styleUrls: ['./statement-preview.component.scss']
})
export class StatementPreviewComponent implements OnChanges {
  @Input() previewData: PreviewData | null = null;

  isCsvData: boolean = false;
  csvHeaders: string[] = [];
  csvRows: Record<string, string>[] = [];
  imageUrls: string[] = []; // Can be single or multiple images

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['previewData'] && this.previewData) {
      this.processPreviewData();
    } else if (changes['previewData'] && !this.previewData) {
      this.resetData(); // Reset if previewData becomes null
    }
  }

  private processPreviewData(): void {
    this.resetData();
    if (!this.previewData) return;

    if (this.isCsvPreviewData(this.previewData)) {
      this.isCsvData = true;
      this.csvHeaders = this.previewData.headers;
      this.csvRows = this.previewData.rows;
    } else if (Array.isArray(this.previewData)) { // string[] for PDF images
      this.isCsvData = false;
      this.imageUrls = this.previewData;
    } else if (typeof this.previewData === 'string') { // string for single image
      this.isCsvData = false;
      this.imageUrls = [this.previewData];
    }
  }

  private isCsvPreviewData(data: PreviewData): data is CsvPreviewData {
    return data !== null && typeof data === 'object' && !Array.isArray(data) && 'headers' in data && 'rows' in data;
  }

  private resetData(): void {
    this.isCsvData = false;
    this.csvHeaders = [];
    this.csvRows = [];
    this.imageUrls = [];
  }
}
