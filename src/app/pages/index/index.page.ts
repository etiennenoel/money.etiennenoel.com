import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DOCUMENT} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {BasePageComponent} from '../../components/base/base-page.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateExpenseModal} from '../../modals/create-expense-modal/create-expense.modal';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  standalone: false,
  styleUrl: './index.page.scss'
})
export class IndexPage extends BasePageComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) document: Document,
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly ngbModal: NgbModal,
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
}
