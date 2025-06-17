import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseImportTable } from './expense-import-table';

describe('ExpenseImportTable', () => {
  let component: ExpenseImportTable;
  let fixture: ComponentFixture<ExpenseImportTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpenseImportTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseImportTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
