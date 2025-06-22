import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Expense} from '../../interfaces/expense.interface';
import {ExpenseRepository} from '../../repositories/expense.repository';
import {MagienoAdvancedTableColumnInterface, TableStateEnum} from '@magieno/angular-advanced-table';
import {SearchQuery, SearchResult} from '@magieno/common';

@Component({
  selector: 'app-debug-logs',
  templateUrl: './debug-logs.page.html',
  styleUrl: './debug-logs.page.scss',
  standalone: false,
})
export class DebugLogsPage implements OnInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  async ngOnInit(): Promise<void> {

  }

}
