import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { CreateExpenseComponent } from './create-expense.component';
import { ExpenseRepository } from '../../stores/expense-repository';
import { ToastStore } from '../../stores/toast.store';
import { RouterTestingModule } from '@angular/router/testing'; // For routerLink or router.navigate

// Mock for ExpenseRepository
class MockExpenseRepository {
  addExpense = jasmine.createSpy('addExpense').and.returnValue(Promise.resolve());
}

// Mock for ToastStore
class MockToastStore {
  showSuccess = jasmine.createSpy('showSuccess');
  showError = jasmine.createSpy('showError');
}

describe('CreateExpenseComponent', () => {
  let component: CreateExpenseComponent;
  let fixture: ComponentFixture<CreateExpenseComponent>;
  let expenseRepository: ExpenseRepository;
  let toastStore: ToastStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateExpenseComponent ],
      imports: [
        ReactiveFormsModule, // Add ReactiveFormsModule here
        RouterTestingModule  // Add RouterTestingModule for router.navigate
      ],
      providers: [
        { provide: ExpenseRepository, useClass: MockExpenseRepository },
        { provide: ToastStore, useClass: MockToastStore }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateExpenseComponent);
    component = fixture.componentInstance;
    expenseRepository = TestBed.inject(ExpenseRepository);
    toastStore = TestBed.inject(ToastStore);
    fixture.detectChanges(); // This will call ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.expenseForm).toBeDefined();
    expect(component.expenseForm.get('description')?.value).toBe('');
    expect(component.expenseForm.get('amount')?.value).toBe(null); // Or 0 depending on initialization
    // Add more checks for other form fields as necessary
  });

  it('should mark form as invalid if required fields are missing', () => {
    component.expenseForm.get('description')?.setValue('');
    component.expenseForm.get('amount')?.setValue(null);
    component.expenseForm.get('transactionDate')?.setValue('');
    component.expenseForm.get('currency')?.setValue('');
    component.expenseForm.get('location')?.setValue('');

    expect(component.expenseForm.valid).toBeFalsy();
  });

  it('should call addExpense and show success toast on valid submission', async () => {
    component.expenseForm.setValue({
      description: 'Test Expense',
      amount: 100,
      transactionDate: '2023-01-01',
      currency: 'USD',
      location: 'Test Location',
      categories: 'test,expense',
      labels: 'test'
    });

    await component.onSubmit();

    expect(expenseRepository.addExpense).toHaveBeenCalled();
    expect(toastStore.showSuccess).toHaveBeenCalledWith('Expense added successfully!');
    // Optionally, check for navigation: expect(router.navigate).toHaveBeenCalledWith(['/expenses']);
  });

  // Add more tests for form validation, error handling, etc.
});
