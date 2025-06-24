import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DOCUMENT, isPlatformServer} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {BasePageComponent} from '../../components/base/base-page.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateExpenseModal} from '../../components/modals/create-expense-modal/create-expense.modal';
import {DashboardPeriodView} from "../../interfaces/dashboard-period.view";
import {ExpenseRepository} from "../../repositories/expense.repository";
import {DateRangeInterface} from "../../interfaces/date-range.interface";
import {SearchQuery, SearchFieldFilter, FilteringOperatorEnum, SearchResult} from "@magieno/common";
import {DateRangeUtils} from '../../utils/date-range.utils';
import {EventStore} from '../../stores/event.store';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  standalone: false,
  styleUrl: './index.page.scss'
})
export class IndexPage extends BasePageComponent implements OnInit {
  public currentPeriodDashboardView?: DashboardPeriodView;
  public previousPeriodDashboardView?: DashboardPeriodView;

  selectedDateRange?: DateRangeInterface;

  constructor(
    @Inject(DOCUMENT) document: Document,
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly ngbModal: NgbModal,
    private readonly expenseRepository: ExpenseRepository,
    private readonly eventStore: EventStore,
    title: Title,
  ) {
    super(document, title);
  }

  override ngOnInit() {
    super.ngOnInit();

    this.setTitle("Trunk Track")

    this.subscriptions.push(this.eventStore.expenseCreatedOrModified.subscribe(() => {
      this.refresh();
    }))
  }

  openNewExpenseModal() {
    this.ngbModal.open(CreateExpenseModal)
  }

  async rangeSelected(event: DateRangeInterface) {
    if(isPlatformServer(this.platformId)) {
      return;
    }

    this.selectedDateRange = event;
    this.refresh();
  }

  async refresh() {
    if(!this.selectedDateRange) {
      return;
    }

    let searchQuery = new SearchQuery();
    searchQuery.addFilter(new SearchFieldFilter('transactionDate', FilteringOperatorEnum.GreaterThanOrEqual, this.selectedDateRange.fromDate));
    searchQuery.addFilter(new SearchFieldFilter('transactionDate', FilteringOperatorEnum.LessThanOrEqual, this.selectedDateRange.toDate));

    const results = await this.expenseRepository.search(searchQuery);
    this.currentPeriodDashboardView = this.getDashboardPeriodView(results);

    // Previous period
    const previousPeriod = DateRangeUtils.getPreviousRange(this.selectedDateRange);

    searchQuery = new SearchQuery();
    searchQuery.addFilter(new SearchFieldFilter('transactionDate', FilteringOperatorEnum.GreaterThanOrEqual, previousPeriod.fromDate));
    searchQuery.addFilter(new SearchFieldFilter('transactionDate', FilteringOperatorEnum.LessThanOrEqual, previousPeriod.toDate));

    const previousResults = await this.expenseRepository.search(searchQuery);
    this.previousPeriodDashboardView = this.getDashboardPeriodView(previousResults);
  }

  getDashboardPeriodView(searchResult: SearchResult<any>): DashboardPeriodView {
    return {
      numberOfTransactions: searchResult.totalNumberOfResults,
      averageAmountPerTransaction: searchResult.totalNumberOfResults === 0 ? 0 : searchResult.results.reduce((sum, expense) => sum + expense.amount, 0) / (searchResult.totalNumberOfResults * 100),
      totalMoneySpent: searchResult.results.reduce((sum, expense) => sum + expense.amount, 0) / 100,
    }
  }

  getPercentageDifference(current?: number, previous?: number) {
    if (!current || !previous) {
      return 0;
    }

    return Math.floor(((current - previous) / previous) * 100);
  }

  getTrendDirection(current: number, previous: number) {
    if (current > previous) {
      return 'up';
    } else if (current < previous) {
      return 'down';
    }

    return 'flat';
  }

  getTrendSentiment(current: number, previous: number, isUpwardsTrendPositive = true) {
    if (current > previous) {
      return isUpwardsTrendPositive ? 'positive' : 'negative';
    } else if (current < previous) {
      return isUpwardsTrendPositive ? 'negative' : 'positive';
    }

    return 'neutral';
  }
}
