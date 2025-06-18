import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DOCUMENT} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {BasePageComponent} from '../../components/base/base-page.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ImportStatementStateEnum} from '../../enums/import-statement-state.enum';
import { StatementImporter, PreviewData } from '../../importers/statement.importer';

@Component({
  selector: 'app-import-statement',
  templateUrl: './import-statement.page.html',
  standalone: false,
  styleUrl: './import-statement.page.scss'
})
export class ImportStatementPage extends BasePageComponent implements OnInit {

  state: ImportStatementStateEnum = ImportStatementStateEnum.WaitingForStatement;
  previewData: PreviewData | null = null;
  currentFile: File | null = null;
  processingError: string | null = null;
  isPreviewLoading: boolean = false; // Added isPreviewLoading

  constructor(
    @Inject(DOCUMENT) document: Document,
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly ngbModal: NgbModal,
    title: Title,
    private readonly statementImporter: StatementImporter
  ) {
    super(document, title);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.setTitle("Import Statement");
  }

  async onFileSystemHandlesDropped(fileSystemHandles: FileSystemHandle[]) {
    this.processingError = null;
    this.previewData = null;
    this.currentFile = null;
    this.state = ImportStatementStateEnum.WaitingForStatement;
    this.isPreviewLoading = false; // Reset

    if (!fileSystemHandles || fileSystemHandles.length === 0) {
        this.processingError = "No file provided.";
        return;
    }

    const fileSystemHandle = fileSystemHandles[0];
    if (!fileSystemHandle) {
        this.processingError = "No file handle available.";
        return;
    }

    if (fileSystemHandle.kind === "directory") {
      this.processingError = "Please drop a single file, not a directory.";
      return;
    }

    const fileSystemFileHandle = fileSystemHandle as FileSystemFileHandle;
    const file = await fileSystemFileHandle.getFile();
    this.currentFile = file;

    this.isPreviewLoading = true; // Indicate loading of preview

    try {
      this.previewData = await this.statementImporter.extractPreviewData(file);
      this.isPreviewLoading = false; // Preview loading finished

      if (this.previewData === null && file.type.startsWith('image/')) {
         this.processingError = "Could not generate preview for this image file. It might be corrupted or an unsupported image format.";
         this.state = ImportStatementStateEnum.WaitingForStatement;
      } else if (this.previewData) {
        if (typeof this.previewData === 'object' && 'headers' in this.previewData && this.previewData.headers.length === 0 && this.previewData.rows.length === 0) {
            this.processingError = "CSV file appears to be empty or does not contain headers.";
            this.state = ImportStatementStateEnum.WaitingForStatement;
        } else {
            this.state = ImportStatementStateEnum.PreviewingStatement; // UPDATED STATE
        }
      } else {
        this.processingError = "Could not generate preview for this file type or the file is empty/corrupted.";
        this.state = ImportStatementStateEnum.WaitingForStatement;
      }
    } catch (error) {
      this.isPreviewLoading = false; // Preview loading finished (with error)
      console.error('Error extracting preview data:', error);
      this.processingError = "Error generating file preview. Please try another file.";
      this.state = ImportStatementStateEnum.WaitingForStatement;
    }
  }

  async confirmAndProcessStatement() {
    if (!this.currentFile) {
      this.processingError = "No file selected for processing.";
      this.state = this.previewData ? ImportStatementStateEnum.PreviewingStatement : ImportStatementStateEnum.WaitingForStatement; // UPDATED STATE
      return;
    }

    this.state = ImportStatementStateEnum.ProcessingStatement;
    this.processingError = null;

    try {
      const expenseOptions = await this.statementImporter.processStatementForLLM(this.currentFile);
      console.log('Processed expense options:', expenseOptions);

      if (expenseOptions && expenseOptions.length > 0) {
         this.state = ImportStatementStateEnum.StatementProcessed;
      } else {
         this.processingError = "No expenses found in the statement, or an error occurred during processing.";
         this.state = ImportStatementStateEnum.PreviewingStatement; // UPDATED STATE
      }
    } catch (error) {
      console.error('Error processing statement with LLM:', error);
      this.processingError = "A critical error occurred while processing the statement with AI. Please try again.";
      this.state = ImportStatementStateEnum.PreviewingStatement; // UPDATED STATE
    }
  }

  protected readonly ImportStatementStateEnum = ImportStatementStateEnum;
}
