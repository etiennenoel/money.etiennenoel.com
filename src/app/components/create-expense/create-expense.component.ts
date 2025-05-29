import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExpenseRepository } from '../../stores/expense-repository';
import { ToastStore } from '../../stores/toast.store';
import { Expense } from '../../interfaces/expense.interface';
import { ToastMessageInterface } from '../../interfaces/toast-message.interface';

@Component({
  selector: 'app-create-expense',
  templateUrl: './create-expense.component.html',
  standalone: false,
})
export class CreateExpenseComponent implements OnInit {
  expenseForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private expenseRepository: ExpenseRepository,
    private toastStore: ToastStore
  ) {}

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
