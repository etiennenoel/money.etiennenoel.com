import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DOCUMENT} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {BasePageComponent} from '../../components/base/base-page.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ImportStatementStateEnum} from '../../enums/import-statement-state.enum';
import { StatementImporter, PreviewData } from '../../importers/statement.importer'; // Added PreviewData

@Component({
  selector: 'app-import-statement',
  templateUrl: './import-statement.page.html',
  standalone: false,
  styleUrl: './import-statement.page.scss' // Kept as styleUrl
})
export class ImportStatementPage extends BasePageComponent implements OnInit {

  state: ImportStatementStateEnum = ImportStatementStateEnum.WaitingForStatement;
  previewData: PreviewData | null = null;
  currentFile: File | null = null; // To store the file for the second processing step
  processingError: string | null = null; // To store any error messages

  constructor(
    @Inject(DOCUMENT) document: Document,
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly ngbModal: NgbModal, // NgbModal was in original constructor, kept it.
    title: Title,
    private readonly statementImporter: StatementImporter
  ) {
    super(document, title);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.setTitle("Import Statement"); // Updated title
  }

  async onFileSystemHandlesDropped(fileSystemHandles: FileSystemHandle[]) {
    this.processingError = null; // Clear previous errors
    this.previewData = null; // Clear previous preview
    this.currentFile = null; // Clear previous file
    this.state = ImportStatementStateEnum.WaitingForStatement; // Reset state initially

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
    this.currentFile = file; // Store the file

    this.state = ImportStatementStateEnum.PRE_PROCESSING_STATEMENT;

    try {
      this.previewData = await this.statementImporter.extractPreviewData(file);
      if (this.previewData === null && file.type.startsWith('image/')) { // Special case for empty image preview (which is valid string if successful)
        // If imageProcessor.extractPreview returns null, it means it's not an image or error.
        // If it returns a string, it's a base64. An empty string might be a valid (but empty) image.
        // The component handles empty imageUrls, but null from extractPreview is an error.
         this.processingError = "Could not generate preview for this image file. It might be corrupted or an unsupported image format.";
         this.state = ImportStatementStateEnum.WaitingForStatement;
      } else if (this.previewData) {
        // Check for empty CSV data more specifically
        if (typeof this.previewData === 'object' && 'headers' in this.previewData && this.previewData.headers.length === 0 && this.previewData.rows.length === 0) {
            this.processingError = "CSV file appears to be empty or does not contain headers.";
            this.state = ImportStatementStateEnum.WaitingForStatement;
        } else {
            this.state = ImportStatementStateEnum.PREVIEW_READY_AWAITING_CONFIRMATION;
        }
      } else {
        this.processingError = "Could not generate preview for this file type or the file is empty/corrupted.";
        this.state = ImportStatementStateEnum.WaitingForStatement;
      }
    } catch (error) {
      console.error('Error extracting preview data:', error);
      this.processingError = "Error generating file preview. Please try another file.";
      this.state = ImportStatementStateEnum.WaitingForStatement;
    }
  }

  async confirmAndProcessStatement() {
    if (!this.currentFile) {
      this.processingError = "No file selected for processing.";
      // If previewData exists, user might be confused, so go back to preview state. Otherwise, waiting.
      this.state = this.previewData ? ImportStatementStateEnum.PREVIEW_READY_AWAITING_CONFIRMATION : ImportStatementStateEnum.WaitingForStatement;
      return;
    }

    this.state = ImportStatementStateEnum.ProcessingStatement;
    this.processingError = null;

    try {
      const expenseOptions = await this.statementImporter.processStatementForLLM(this.currentFile);
      console.log('Processed expense options:', expenseOptions);

      if (expenseOptions && expenseOptions.length > 0) {
         // TODO: This will eventually transition to ReviewExpensesFound state and pass data.
         // For now, using StatementProcessed as a placeholder.
         this.state = ImportStatementStateEnum.StatementProcessed;
         // this.expensesForReview = expenseOptions; // Store for review component if needed
      } else {
         this.processingError = "No expenses found in the statement, or an error occurred during processing.";
         this.state = ImportStatementStateEnum.PREVIEW_READY_AWAITING_CONFIRMATION;
      }
    } catch (error) {
      console.error('Error processing statement with LLM:', error);
      this.processingError = "A critical error occurred while processing the statement with AI. Please try again.";
      this.state = ImportStatementStateEnum.PREVIEW_READY_AWAITING_CONFIRMATION;
    }
  }

  // Expose enum to template
  protected readonly ImportStatementStateEnum = ImportStatementStateEnum;
}
