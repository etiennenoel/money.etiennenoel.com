import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {IndexComponent} from './pages/index/index.component';
import { ExpenseList } from './pages/expense-list/expense-list'; // Import ExpenseList
import { CreateExpensePage } from './pages/create-expense/create-expense.page';

const routes: Routes = [
  {
    path: "",
    component: IndexComponent,
  },
  {
    path: 'expenses', // New route
    component: ExpenseList
  },
  {
    path: 'expenses/create',
    component: CreateExpensePage
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
