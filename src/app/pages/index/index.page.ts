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
import {SearchQuery, SearchFieldFilter, FilteringOperatorEnum} from "@magieno/common";

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  standalone: false,
  styleUrl: './index.page.scss'
})
export class IndexPage extends BasePageComponent implements OnInit {
  public currentPeriodDashboardView!: DashboardPeriodView;
  public previousPeriodDashboardView!: DashboardPeriodView;

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

  rangeSelected(event: DateRangeInterface) {
    // TODO: Implement range selection logic
    console.log("Range selected:", event);
    const searchQuery = new SearchQuery();
    if (event.startDate) {
      searchQuery.addFilter(new SearchFieldFilter('transactionDate', FilteringOperatorEnum.GreaterThanOrEqual, event.startDate));
    }
    if (event.endDate) {
      searchQuery.addFilter(new SearchFieldFilter('transactionDate', FilteringOperatorEnum.LessThanOrEqual, event.endDate));
    }
    console.log("SearchQuery created with filters:", searchQuery);
  }
}
