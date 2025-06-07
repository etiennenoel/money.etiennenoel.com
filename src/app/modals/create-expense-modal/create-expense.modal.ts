import {Component, Inject, Input, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {DOCUMENT} from '@angular/common';
import {BaseComponent} from '../../components/base/base.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-expense-modal',
  templateUrl: './create-expense.modal.html',
  standalone: false,
  styleUrl: './create-expense.modal.scss'
})
export class CreateExpenseModal extends BaseComponent implements OnInit {

  isCreateExpenseDisabled: boolean = false;

  constructor(
    @Inject(DOCUMENT) document: Document,
    public activeModal: NgbActiveModal,
  ) {
    super(document);
  }

  override ngOnInit() {
    super.ngOnInit();
  }

  createExpense() {

  }
}
