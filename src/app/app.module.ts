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
import {ExpenseRepository} from './repositories/expense-repository';
import { CreateExpenseComponent } from './components/create-expense/create-expense.component';
import { CreateExpensePage } from './pages/create-expense/create-expense.page';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {TopbarComponent} from './components/topbar/topbar.component';
import {StatsCardComponent} from './components/stats-card/stats-card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DatepickerRangeComponent} from './components/datepicker-range/datepicker-range.component';
import { ExpenseManager } from './managers/expense.manager';
import {CreateExpenseModal} from './modals/create-expense-modal/create-expense.modal';

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
    NgbModule // Add CommonModule here
  ],
  providers: [
    provideClientHydration(withEventReplay()),

    // Repositories
    ExpenseRepository,

    // Managers
    ExpenseManager,

    ToastStore,
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }
