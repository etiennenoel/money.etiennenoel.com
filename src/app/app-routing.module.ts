import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {IndexPage} from './pages/index/index.page';
import { ExpenseListPage } from './pages/expense-list/expense-list.page'; // Import ExpenseListPage
import { CreateExpensePage } from './pages/create-expense/create-expense.page';
import {RootComponent} from './components/root/root.component';
import {LayoutComponent} from './components/layout/layout.component';
import {ImportStatementPage} from './pages/import-statement/import-statement.page';

const routes: Routes = [
  {
    path: "",
    component: RootComponent,
    children: [
      {
        path: "",
        component: LayoutComponent,
        children: [
          {
            path: "",
            component: IndexPage,
          },
          {
            path: 'expenses',
            component: ExpenseListPage
          },
          {
            path: 'expenses/create',
            component: CreateExpensePage
          },
          {
            path: 'import-statement',
            component: ImportStatementPage
          },
        ]
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
