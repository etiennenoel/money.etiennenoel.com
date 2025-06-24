import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import FormsModule and ReactiveFormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule

import { AppRoutingModule } from './app-routing.module';
import {BaseComponent} from './components/base/base.component';
import {BasePageComponent} from './components/base/base-page.component';
import {LayoutComponent} from './components/layout/layout.component';
import {RootComponent} from './components/root/root.component';
import {IndexPage} from './pages/index/index.page';
import {ToastComponent} from './components/toast/toast.component';
import {ToastStore} from './stores/toast.store';
import { ExpenseListPage } from './pages/expense-list/expense-list.page';
import {ExpenseRepository} from './repositories/expense.repository';
import { CategoryRepository } from './repositories/category.repository';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {TopbarComponent} from './components/topbar/topbar.component';
import {StatsCardComponent} from './components/stats-card/stats-card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DatepickerRangeComponent} from './components/datepicker-range/datepicker-range.component';
import {CreateExpenseModal} from './components/modals/create-expense-modal/create-expense.modal';
import {MagienoCoreModule} from '@magieno/angular-core';
import {MagienoAdvancedFormsModule} from '@magieno/angular-advanced-forms';
import {provideTranslateService, TranslateModule} from '@ngx-translate/core';
import {CategoriesProvider} from './providers/categories.provider';
import {LabelsProvider} from './providers/labels.provider';
import {MagienoDragAndDropComponent} from '@magieno/angular-drag-and-drop';
import {ImportStatementPage} from './pages/import-statement/import-statement.page';
import { CsvProcessor } from './processors/csv.processor';

// Import the PdfProcessor service
import { PdfProcessor } from './processors/pdf.processor';
// Import the ImageProcessorService
import { ImageProcessor } from './processors/image.processor';
import { ExpenseImportTable } from './components/expense-import-table/expense-import-table';
import { StatementPreviewComponent } from './components/statement-preview/statement-preview.component';
import {
  AutoDataMappingBuilder,
  DataMapper,
  DateNormalizer,
  NumberNormalizer,
  StringNormalizer
} from '@pristine-ts/data-mapping-common';
import {MagienoAdvancedTableComponent} from '@magieno/angular-advanced-table';
import {DebugLogsPage} from './pages/debug-logs/debug-logs.page';
import {LabelRepository} from './repositories/label.repository';
import {PromptProvider} from './providers/prompt.provider';
import {MagienoCodeEditorComponent} from '@magieno/angular-code-editor';
import {EventStore} from './stores/event.store';

@NgModule({
  declarations: [
    LayoutComponent,
    RootComponent,

    SidebarComponent,
    ToastComponent,
    TopbarComponent,

    DatepickerRangeComponent,

    // Pages
    DebugLogsPage,
    IndexPage,
    ExpenseListPage,
    ImportStatementPage,

    // Components
    StatsCardComponent,

    // Modals
    CreateExpenseModal,
    ExpenseImportTable,
    StatementPreviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, // Add FormsModule here
    ReactiveFormsModule,
    CommonModule,
    NgbModule, // Add CommonModule here

    MagienoCoreModule,
    MagienoAdvancedFormsModule,
    MagienoDragAndDropComponent,
    MagienoAdvancedTableComponent,
    MagienoCodeEditorComponent,

    TranslateModule,
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideTranslateService(),

    {
      provide: "environment.activate-debug-tools",
      useValue: false,
    },

    // Repositories
    ExpenseRepository,
    CategoryRepository,
    LabelRepository,

    // Providers
    CategoriesProvider,
    LabelsProvider,
    PdfProcessor, // Add PdfProcessor here
    PromptProvider,

    // Stores,
    EventStore,
    ToastStore,

    // Services
    CsvProcessor,
    ImageProcessor, // Add ImageProcessorService here
    {
      provide: DataMapper,
      useValue: new DataMapper(new AutoDataMappingBuilder(), [new StringNormalizer(), new DateNormalizer(), new NumberNormalizer()], []),
    },
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }
