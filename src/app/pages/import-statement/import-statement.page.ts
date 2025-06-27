import {Component, Inject, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DOCUMENT} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {BasePageComponent} from '../../components/base/base-page.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ImportStatementStateEnum} from '../../enums/import-statement-state.enum';
import { StatementImporter } from '../../importers/statement.importer';
import { CreateExpenseOptions } from '../../options/create-expense.options';
import {PreviewData} from '../../types/preview-data.type';
import {ApplicationStateService, LoggingService} from '@magieno/angular-core';
import {PromptProvider} from '../../providers/prompt.provider';
import {ApplicationStateParameterEnum} from '../../enums/application-state-parameter.enum';

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
  expenseOptions: CreateExpenseOptions[] = [];

  debugCollapsed: boolean = true;

  constructor(
    @Inject(DOCUMENT) document: Document,
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly ngbModal: NgbModal,
    title: Title,
    private readonly statementImporter: StatementImporter,
    private readonly loggingService: LoggingService,
    protected readonly promptProvider: PromptProvider,
    private readonly applicationState: ApplicationStateService,
  ) {
    super(document, title);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.setTitle("Import Statement");

    this.registerSubscription(this.applicationState.getState<boolean>(ApplicationStateParameterEnum.DebugPanelCollapsedImportStatement)?.subscribe((value: boolean) => {
      this.debugCollapsed = value;
    }))

  }

  debugCollapsedChange() {
    this.applicationState.updateState(ApplicationStateParameterEnum.DebugPanelCollapsedImportStatement, this.debugCollapsed);
  }

  async onFileSystemHandlesDropped(fileSystemHandles: FileSystemHandle[]) {
    this.processingError = null;
    this.previewData = null;
    this.currentFile = null;
    this.state = ImportStatementStateEnum.WaitingForStatement;

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

    this.state = ImportStatementStateEnum.ProcessingStatement;

    try {
      this.previewData = await this.statementImporter.extractPreviewData(file);

      if (this.previewData === null && file.type.startsWith('image/')) {
         this.processingError = "Could not generate preview for this image file. It might be corrupted or an unsupported image format.";
         this.state = ImportStatementStateEnum.WaitingForStatement;
      } else if (this.previewData) {
        if (typeof this.previewData === 'object' && 'headers' in this.previewData && this.previewData.headers.length === 0 && this.previewData.rows.length === 0) {
            this.processingError = "CSV file appears to be empty or does not contain headers.";
            this.state = ImportStatementStateEnum.WaitingForStatement;
        } else {
            this.state = ImportStatementStateEnum.PreviewingStatement;
        }
      } else {
        this.processingError = "Could not generate preview for this file type or the file is empty/corrupted.";
        this.state = ImportStatementStateEnum.WaitingForStatement;
      }
    } catch (error: any) {
      this.loggingService.error('Error extracting preview data:', {message: error.message, error});
      this.processingError = "Error generating file preview. Please try another file.";
      this.state = ImportStatementStateEnum.WaitingForStatement;
    }
  }

  async confirmAndProcessStatement() {
    if (!this.currentFile) {
      this.processingError = "No file selected for processing.";
      this.state = this.previewData ? ImportStatementStateEnum.PreviewingStatement : ImportStatementStateEnum.WaitingForStatement;
      return;
    }

    this.state = ImportStatementStateEnum.ProcessingStatement;
    this.processingError = null;

    try {
      this.expenseOptions = await this.statementImporter.process(this.currentFile);
      this.loggingService.debug('Processed expense options:', this.expenseOptions);

      if (this.expenseOptions && this.expenseOptions.length > 0) {
         this.state = ImportStatementStateEnum.ReviewExpensesFound;
      } else {
         this.processingError = "No expenses found in the statement, or an error occurred during processing.";
         this.state = ImportStatementStateEnum.PreviewingStatement;
      }
    } catch (error: any) {
      this.loggingService.error('Error processing statement with LLM:', {message: error.message, error});
      this.processingError = "A critical error occurred while processing the statement with AI. Please try again.";
      this.state = ImportStatementStateEnum.PreviewingStatement;
    }
  }

  protected readonly ImportStatementStateEnum = ImportStatementStateEnum;
}
