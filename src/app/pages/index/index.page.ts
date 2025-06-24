import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DOCUMENT} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {BasePageComponent} from '../../components/base/base-page.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateExpenseModal} from '../../components/modals/create-expense-modal/create-expense.modal';
import {DashboardPeriodView} from "../../interfaces/dashboard-period.view";
import {ExpenseRepository} from "../../repositories/expense.repository";
import {DateRangeInterface} from "../../interfaces/date-range.interface";
import {SearchQuery, SearchFieldFilter, FilteringOperatorEnum, SearchResult} from "@magieno/common";
import {DateRangeUtils} from '../../utils/date-range.utils';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  standalone: false,
  styleUrl: './index.page.scss'
})
export class IndexPage extends BasePageComponent implements OnInit {
  public currentPeriodDashboardView?: DashboardPeriodView;
  public previousPeriodDashboardView?: DashboardPeriodView;

  constructor(
    @Inject(DOCUMENT) document: Document,
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly ngbModal: NgbModal,
    private readonly expenseRepository: ExpenseRepository,
    title: Title,
  ) {
    super(document, title);
  }

  override ngOnInit() {
    super.ngOnInit();

    this.setTitle("Trunk Track")
  }

  openNewExpenseModal() {
    this.ngbModal.open(CreateExpenseModal)
  }

  async rangeSelected(event: DateRangeInterface) {
    let searchQuery = new SearchQuery();
    searchQuery.addFilter(new SearchFieldFilter('transactionDate', FilteringOperatorEnum.GreaterThanOrEqual, event.fromDate));
    searchQuery.addFilter(new SearchFieldFilter('transactionDate', FilteringOperatorEnum.LessThanOrEqual, event.toDate));

    const results = await this.expenseRepository.search(searchQuery);
    this.currentPeriodDashboardView = this.getDashboardPeriodView(results);

    // Previous period
    const previousPeriod = DateRangeUtils.getPreviousRange(event);

    searchQuery = new SearchQuery();
    searchQuery.addFilter(new SearchFieldFilter('transactionDate', FilteringOperatorEnum.GreaterThanOrEqual, previousPeriod.fromDate));
    searchQuery.addFilter(new SearchFieldFilter('transactionDate', FilteringOperatorEnum.LessThanOrEqual, previousPeriod.toDate));

    const previousResults = await this.expenseRepository.search(searchQuery);
    this.previousPeriodDashboardView = this.getDashboardPeriodView(previousResults);
  }

  getDashboardPeriodView(searchResult: SearchResult<any>): DashboardPeriodView {
    return {
      numberOfTransactions: searchResult.totalNumberOfResults,
      averageAmountPerTransaction: searchResult.results.reduce((sum, expense) => sum + expense.amount, 0) / searchResult.totalNumberOfResults,
      totalMoneySpent: searchResult.results.reduce((sum, expense) => sum + expense.amount, 0)
    }
  }

  getPercentageDifference(current?: number, previous?: number) {
    if(!current || !previous) {
      return 0;
    }

    return ((current - previous) / previous) * 100;
  }

  getTrendDirection(current: number, previous: number) {
    if (current > previous) {
      return 'up';
    } else if (current < previous) {
      return 'down';
    }

    return '';
  }

  getTrendSentiment(current: number, previous: number) {
    if (current > previous) {
      return 'positive';
    }

    return 'negative';
  }
}
