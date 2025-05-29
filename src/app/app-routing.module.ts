import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {IndexComponent} from './pages/index/index.component';
import { ExpenseList } from './pages/expense-list/expense-list'; // Import ExpenseList

const routes: Routes = [
  {
    path: "",
    component: IndexComponent,
  },
  {
    path: 'expenses', // New route
    component: ExpenseList
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
