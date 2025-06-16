import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DOCUMENT} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {BasePageComponent} from '../../components/base/base-page.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateExpenseModal} from '../../components/modals/create-expense-modal/create-expense.modal';
import {ImportStatementStateEnum} from '../../enums/import-statement-state.enum';
import { StatementImporter } from '../../importers/statement.importer';

@Component({
  selector: 'app-import-statement',
  templateUrl: './import-statement.page.html',
  standalone: false,
  styleUrl: './import-statement.page.scss'
})
export class ImportStatementPage extends BasePageComponent implements OnInit {

  state: ImportStatementStateEnum = ImportStatementStateEnum.WaitingForStatement;

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

    this.setTitle("Trunk Track")
  }

  onFileSystemHandlesDropped(fileSystemHandles: FileSystemHandle[]) {
    fileSystemHandles.forEach(async (fileSystemHandle) => {
      if (fileSystemHandle.kind === "directory") {
        return;
      }

      const fileSystemFileHandle = fileSystemHandle as FileSystemFileHandle;
      const file = await fileSystemFileHandle.getFile()

      console.log("Yesh")

      // TODO: Add checks for file type and error handling
      this.statementImporter.process(file).then(expenseOptions => {
        console.log('Imported expense options:', expenseOptions);
        // TODO: Set state to processing and then to display results
      }).catch(error => {
        console.error('Error processing statement:', error);
        // TODO: Set state to error
      });

      // if (file.type.startsWith("audio")) {
      //   this.fileSystemFileHandle = fileSystemHandle as FileSystemFileHandle;
      //   this.audioSrc = URL.createObjectURL(file);
      // } else {
      //   this.error = new Error(`Unsupported file type '${file.type}' for '${file.name}'.`);
      //   this.outputCollapsed = false;
      //   this.status = TaskStatus.Error;
      // }
    })
  }

  protected readonly ImportStatementStateEnum = ImportStatementStateEnum;
}
