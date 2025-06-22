import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugLogsPage } from './debug-logs.page';

describe('ExpenseListPage', () => {
  let component: DebugLogsPage;
  let fixture: ComponentFixture<DebugLogsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DebugLogsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebugLogsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
