import {Component, Inject, Input, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {DOCUMENT} from '@angular/common';
import {BaseComponent} from '../../base/base.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AdvancedForm, FormFactory} from "@magieno/angular-advanced-forms";
import {CreateExpenseOptions} from "../../../options/create-expense.options";
import {Expense} from '../../../interfaces/expense.interface';
import {ExpenseRepository} from '../../../repositories/expense.repository';
import {ExpenseManager} from '../../../managers/expense.manager';

@Component({
  selector: 'app-create-expense-modal',
  templateUrl: './create-expense.modal.html',
  standalone: false,
  styleUrl: './create-expense.modal.scss'
})
export class CreateExpenseModal extends BaseComponent implements OnInit {

  searchCategory: string = "";

  isCreateExpenseDisabled: boolean = false;

  protected form: AdvancedForm<CreateExpenseOptions>;

  constructor(
    @Inject(DOCUMENT) document: Document,
    public activeModal: NgbActiveModal,
    private readonly formFactory: FormFactory,
    private readonly expenseManager: ExpenseManager,
  ) {
    super(document);

    this.form = this.formFactory.create(new CreateExpenseOptions());
  }

  override ngOnInit() {
    super.ngOnInit();
  }

  async createExpense() {
    await this.expenseManager.create(this.form.value);
  }
}
