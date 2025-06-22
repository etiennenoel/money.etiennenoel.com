import {Component, Inject, Input, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {DOCUMENT} from '@angular/common';
import {BaseComponent} from '../../base/base.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AdvancedForm, FormFactory, FormLifecycleStatusEnum} from "@magieno/angular-advanced-forms";
import {CreateExpenseOptions} from "../../../options/create-expense.options";
import {ToastStore} from '../../../stores/toast.store';
import {ExpenseRepository} from '../../../repositories/expense.repository';

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
    private readonly expenseRepository: ExpenseRepository,
    private readonly toastStore: ToastStore
  ) {
    super(document);

    this.form = this.formFactory.create(new CreateExpenseOptions());
  }

  override ngOnInit() {
    super.ngOnInit();
  }

  async createExpense() {
    // Validate the form first.
    const validationErrors = await this.form.validate();
    if (validationErrors && validationErrors.length > 0) {
      this.form.setButtonLifecycleStatus(FormLifecycleStatusEnum.ReadyForInput);
      this.form.lifecycleStatus = FormLifecycleStatusEnum.ReadyForInput;
      return;
    }

    await this.expenseRepository.create(this.form.value);

    this.activeModal.close(true);
    this.toastStore.publish({
      message:"Expense created succesfully",
      position: "bottom",
    })
  }
}
