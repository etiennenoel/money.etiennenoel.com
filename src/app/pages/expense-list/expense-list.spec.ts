import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // For ngModel
import { CommonModule } from '@angular/common'; // For *ngIf, *ngFor, pipes (date, currency)
import { ExpenseList } from './expense-list.page'; // Updated import path
import { ExpenseRepository } from '../../stores/expense-repository';
import { MOCK_EXPENSES } from '../../stores/mock-expenses';
import { By } from '@angular/platform-browser';

// Mock for ExpenseRepository
class MockExpenseRepository {
  // Mock any methods used by ExpenseList if necessary
  // For ngOnInit, it seems to directly use MOCK_EXPENSES, so complex mocking might not be needed
  // unless other methods are called.
}

describe('ExpenseList', () => {
  let component: ExpenseList;
  let fixture: ComponentFixture<ExpenseList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpenseList],
      imports: [
        FormsModule,    // Add FormsModule
        CommonModule    // Add CommonModule
      ],
      providers: [
        { provide: ExpenseRepository, useClass: MockExpenseRepository }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseList);
    component = fixture.componentInstance;
    // Provide mock data directly to the component for testing ngOnInit and rendering
    component.allExpenses = JSON.parse(JSON.stringify(MOCK_EXPENSES)); // Deep copy to avoid test interference
    component.expenses = JSON.parse(JSON.stringify(MOCK_EXPENSES));
    fixture.detectChanges(); // This calls ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a list of expenses', () => {
    // Ensure MOCK_EXPENSES has items for this test
    if (MOCK_EXPENSES.length > 0) {
      const tableRows = fixture.debugElement.queryAll(By.css('.expenses-table tbody tr'));
      expect(tableRows.length).toBe(MOCK_EXPENSES.length);
    } else {
      const noExpensesMessage = fixture.debugElement.query(By.css('p'));
      expect(noExpensesMessage.nativeElement.textContent).toContain('No expenses found.');
    }
  });

  it('should filter expenses based on search term', () => {
    component.searchTerm = 'coffee'; // Assuming 'coffee' is in one of the mock expenses' description
    component.applyFilters();
    fixture.detectChanges();

    const tableRows = fixture.debugElement.queryAll(By.css('.expenses-table tbody tr'));
    // This expectation depends on how many mock expenses match 'coffee'
    // For example, if one mock expense has 'coffee':
    const expectedFilteredCount = MOCK_EXPENSES.filter(e => e.description.toLowerCase().includes('coffee')).length;
    if (expectedFilteredCount > 0) {
      expect(tableRows.length).toBe(expectedFilteredCount);
      expect(tableRows[0].nativeElement.textContent).toContain('Coffee');
    } else {
       const noExpensesMessage = fixture.debugElement.query(By.css('p'));
       expect(noExpensesMessage.nativeElement.textContent).toContain('No expenses found.');
    }
  });

  // Add more tests for sorting, empty states, etc.
});
