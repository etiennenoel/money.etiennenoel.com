import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {IndexPage} from './pages/index/index.page';
import { ExpenseListPage } from './pages/expense-list/expense-list.page'; // Import ExpenseListPage
import {RootComponent} from './components/root/root.component';
import {LayoutComponent} from './components/layout/layout.component';
import {ImportStatementPage} from './pages/import-statement/import-statement.page';
import {RouteEnum} from './enums/route.enum';
import {DebugLogsPage} from './pages/debug-logs/debug-logs.page';

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
            path: RouteEnum.Expenses,
            component: ExpenseListPage
          },
          {
            path: RouteEnum.ImportStatement,
            component: ImportStatementPage
          },
          {
            path: RouteEnum.DebugLogs,
            component: DebugLogsPage
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
