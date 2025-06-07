import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExpenseRepository } from '../../repositories/expense-repository';
import { ToastStore } from '../../stores/toast.store';
import { Expense } from '../../interfaces/expense.interface';
import { ToastMessageInterface } from '../../interfaces/toast-message.interface';
import { isPlatformBrowser } from '@angular/common';
import { Injector } from '@angular/core';

@Component({
  selector: 'app-create-expense',
  templateUrl: './create-expense.form.html',
  standalone: false,
})
export class CreateExpenseForm implements OnInit {
  expenseForm!: FormGroup;
  private expenseRepository?: ExpenseRepository;

  constructor(
    private fb: FormBuilder,
    private toastStore: ToastStore,
    @Inject(PLATFORM_ID) private platformId: Object,
    private injector: Injector
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.expenseRepository = this.injector.get(ExpenseRepository);
    }
  }

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      transactionDate: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern(/^[0-9]*\.?[0-9]+$/), Validators.min(0.01)]],
      currency: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      location: [''],
      description: ['', [Validators.required]],
      categories: [''],
      labels: ['']
    });
  }

  onSubmit(): void {
    if (!this.expenseRepository) {
      this.toastStore.publish({ message: 'Cannot create expense: repository not available.' });
      console.error('ExpenseRepository not available on submit');
      return;
    }

    if (this.expenseForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formValues = this.expenseForm.value;
    const categories = formValues.categories ? formValues.categories.split(',').map((s: string) => s.trim()) : [];
    const labels = formValues.labels ? formValues.labels.split(',').map((s: string) => s.trim()) : [];

    const expenseData: Omit<Expense, 'id' | 'createdAt'> = {
      transactionDate: new Date(formValues.transactionDate),
      amount: parseFloat(formValues.amount),
      currency: formValues.currency.toUpperCase(),
      location: formValues.location,
      description: formValues.description,
      categories: categories,
      labels: labels,
    };

    this.expenseRepository.create(expenseData)
      .then((createdExpense) => { // 'createdExpense' is the resolved value from the Promise
        // Success logic
        this.toastStore.publish({ message: 'Expense created successfully!' });
        this.expenseForm.reset();
        // Optional: Full form reset logic previously included
        Object.keys(this.expenseForm.controls).forEach(key => {
          const control = this.expenseForm.get(key);
          control?.clearValidators();
          control?.updateValueAndValidity();
          control?.setErrors(null);
          control?.markAsPristine();
          control?.markAsUntouched();
        });
      })
      .catch((error: any) => {
        // Error logic
        this.toastStore.publish({ message: 'Error creating expense.' });
        console.error('Error creating expense:', error);
      });
  }

  private markAllAsTouched(): void {
    Object.values(this.expenseForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
