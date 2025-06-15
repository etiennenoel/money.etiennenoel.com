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
import { CreateExpenseComponent } from './components/create-expense/create-expense.component';
import { CreateExpensePage } from './pages/create-expense/create-expense.page';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {TopbarComponent} from './components/topbar/topbar.component';
import {StatsCardComponent} from './components/stats-card/stats-card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DatepickerRangeComponent} from './components/datepicker-range/datepicker-range.component';
import { ExpenseManager } from './managers/expense.manager';
import {CreateExpenseModal} from './components/modals/create-expense-modal/create-expense.modal';
import {MagienoCoreModule} from '@magieno/angular-core';
import {MagienoAdvancedFormsModule} from '@magieno/angular-advanced-forms';
import {provideTranslateService, TranslateModule} from '@ngx-translate/core';
import {CategoriesProvider} from './providers/categories.provider';
import {LabelsProvider} from './providers/labels.provider';

@NgModule({
  declarations: [
    LayoutComponent,
    RootComponent,

    SidebarComponent,
    ToastComponent,
    TopbarComponent,

    DatepickerRangeComponent,

    // Pages
    IndexPage,
    ExpenseListPage,
    CreateExpensePage,

    // Components
    CreateExpenseComponent,
    StatsCardComponent,

    // Modals
    CreateExpenseModal,
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

    // Managers
    ExpenseManager,

    // Providers
    CategoriesProvider,
    LabelsProvider,

    // Stores,
    ToastStore,
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }
