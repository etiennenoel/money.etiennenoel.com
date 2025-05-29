import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import FormsModule and ReactiveFormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule

import { AppRoutingModule } from './app-routing.module';
import {BaseComponent} from './components/base/base.component';
import {BasePageComponent} from './components/base/base-page.component';
import {LayoutComponent} from './components/layout/layout.component';
import {RootComponent} from './components/root/root.component';
import {IndexComponent} from './pages/index/index.component';
import {ToastComponent} from './components/toast/toast.component';
import {ToastStore} from './stores/toast.store';
import { ExpenseList } from './pages/expense-list/expense-list';
import {ExpenseRepository} from './stores/expense-repository';
import { CreateExpenseComponent } from './components/create-expense/create-expense.component';
import { CreateExpensePage } from './pages/create-expense/create-expense.page';

@NgModule({
  declarations: [
    LayoutComponent,
    RootComponent,

    ToastComponent,

    // Pages
    IndexComponent,
    ExpenseList,
    CreateExpensePage,

    // Components
    CreateExpenseComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, // Add FormsModule here
    ReactiveFormsModule,
    CommonModule // Add CommonModule here
  ],
  providers: [
    provideClientHydration(withEventReplay()),

    // Repositories
    ExpenseRepository,

    ToastStore,
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }
