import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Expense} from '../../interfaces/expense.interface';
import {ExpenseRepository} from '../../repositories/expense.repository';
import {MagienoAdvancedTableColumnInterface, TableStateEnum} from '@magieno/angular-advanced-table';
import {SearchQuery, SearchResult} from '@magieno/common';
import {isPlatformServer} from '@angular/common';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.page.html',
  styleUrl: './expense-list.page.scss',
  standalone: false,
})
export class ExpenseListPage implements OnInit {

  columns: MagienoAdvancedTableColumnInterface[] = [
    {
      keyname: "transactionDate",
      isSortable: true,
      displayText: "Transaction Date"
    },{
      keyname: "description",
      isSortable: true,
      displayText: "Description"
    },{
      keyname: "amount",
      isSortable: true,
      displayText: "Amount"
    },{
      keyname: "actions",
      isSortable: false,
      displayText: "Actions"
    },
  ]

  searchQuery: SearchQuery = new SearchQuery();

  tableState: TableStateEnum = TableStateEnum.Loaded;

  public searchResult: SearchResult<Expense> = new SearchResult(); // Stores filtered and sorted expenses for display

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly expenseRepository: ExpenseRepository,
  ) {
  }

  async ngOnInit(): Promise<void> {
    if(isPlatformServer(this.platformId)) {
      return;
    }

    this.refresh();
  }

  async refresh() {
    this.tableState = TableStateEnum.Refreshing;
    this.searchResult = await this.expenseRepository.search(this.searchQuery)
    this.tableState = TableStateEnum.Loaded;
  }
}
