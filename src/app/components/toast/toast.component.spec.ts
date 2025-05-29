import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common'; // For *ngIf
import { ToastComponent } from './toast.component';
import { ToastStore } from '../../stores/toast.store';
import { ToastMessage } from '../../interfaces/toast-message.interface';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

// Mock for ToastStore
class MockToastStore {
  toastMessages$ = of(null); // Default to no message
  hideMessage = jasmine.createSpy('hideMessage');

  // Helper to simulate showing a message
  _triggerMessage(message: ToastMessage | null) {
    this.toastMessages$ = of(message);
  }
}

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let toastStore: MockToastStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToastComponent],
      imports: [CommonModule], // For *ngIf used in the template
      providers: [{ provide: ToastStore, useClass: MockToastStore }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    toastStore = TestBed.inject(ToastStore) as unknown as MockToastStore;
    // fixture.detectChanges(); // Initial detectChanges without a message
  });

  it('should create', () => {
    fixture.detectChanges(); // For initial ngOnInit call
    expect(component).toBeTruthy();
  });

  it('should not display toast when there is no message', () => {
    toastStore._triggerMessage(null);
    fixture.detectChanges();
    const toastElement = fixture.debugElement.query(By.css('.toast-container'));
    expect(toastElement).toBeNull();
  });

  it('should display toast with message when a message is emitted', () => {
    const testMessage: ToastMessage = { type: 'success', message: 'Test success!' };
    toastStore._triggerMessage(testMessage);
    fixture.detectChanges();

    const toastElement = fixture.debugElement.query(By.css('.toast-container.success'));
    expect(toastElement).toBeTruthy();
    const messageDiv = fixture.debugElement.query(By.css('.toast-container div'));
    expect(messageDiv.nativeElement.textContent).toBe('Test success!');
  });

  it('should call hideMessage on ToastStore when close button is clicked', () => {
    const testMessage: ToastMessage = { type: 'error', message: 'Test error!' };
    toastStore._triggerMessage(testMessage);
    fixture.detectChanges();

    const closeButton = fixture.debugElement.query(By.css('.toast-container button.close-button'));
    expect(closeButton).toBeTruthy();
    closeButton.triggerEventHandler('click', null);
    expect(toastStore.hideMessage).toHaveBeenCalledWith(testMessage);
  });

  // Regarding NG8107: message?.message
  // The component's template is:
  // <div *ngIf="message" class="toast-container" [ngClass]="message.type">
  //   <div>{{ message?.message }}</div>  <-- Here is the ?.
  //   <button class="close-button" (click)="onClose()">&times;</button>
  // </div>
  // Since the outer div has *ngIf="message", 'message' will not be null or undefined
  // when 'message.message' is accessed. So, 'message.message' should be safe.
  // This test file doesn't directly fix the template, but confirms behavior.
  // The warning NG8107 is a template linting warning, not a test failure itself.
  // To fix the warning, the template should be changed from message?.message to message.message.
});
