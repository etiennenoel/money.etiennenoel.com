import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RootComponent } from './root.component';
import { By } from '@angular/platform-browser';

// Stub for LayoutComponent
@Component({
  selector: 'app-layout',
  template: '<div class="mock-layout"><ng-content></ng-content></div>' // ng-content if RootComponent projects content
})
class MockLayoutComponent {}

// Stub for ToastComponent
@Component({
  selector: 'app-toast',
  template: '<div class="mock-toast">Mock Toast</div>'
})
class MockToastComponent {}

describe('RootComponent', () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;

  beforeEach(async () => {
    // RootComponent itself is standalone and imports its template's dependencies.
    // However, for testing, we often declare it if it's not truly standalone or to provide mocks.
    // Let's assume RootComponent is NOT standalone for this test setup,
    // or that we need to override its declared dependencies with mocks.
    // If RootComponent is standalone and already imports LayoutComponent and ToastComponent,
    // then we might not need to declare them here, or use overrideComponent.
    // Given the previous errors, it's safer to declare them.
    await TestBed.configureTestingModule({
      declarations: [
        RootComponent,
        MockLayoutComponent,
        MockToastComponent
      ],
      // If RootComponent were standalone and importing its dependencies,
      // we might need:
      // imports: [ RootComponent ]
      // and then potentially use overrideComponent for mocks if needed.
      // For now, declaring RootComponent here implies it's being treated as non-standalone for the test.
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-layout', () => {
    const layoutElement = fixture.debugElement.query(By.css('app-layout'));
    expect(layoutElement).toBeTruthy();
  });

  it('should render app-toast', () => {
    const toastElement = fixture.debugElement.query(By.css('app-toast'));
    expect(toastElement).toBeTruthy();
  });
});
