import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { LayoutComponent } from './layout.component';
import { By } from '@angular/platform-browser';

// Stub for SidebarComponent
@Component({
  selector: 'app-sidebar',
  template: '<div class="mock-sidebar">Mock Sidebar</div>'
})
class MockSidebarComponent {}

// Stub for HeaderComponent
@Component({
  selector: 'app-header',
  template: '<div class="mock-header">Mock Header</div>'
})
class MockHeaderComponent {}

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LayoutComponent,
        MockSidebarComponent,
        MockHeaderComponent
      ],
      imports: [ RouterTestingModule ] // For router-outlet
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-sidebar', () => {
    const sidebarElement = fixture.debugElement.query(By.css('app-sidebar'));
    expect(sidebarElement).toBeTruthy();
    expect(sidebarElement.nativeElement.textContent).toContain('Mock Sidebar');
  });

  it('should render app-header', () => {
    const headerElement = fixture.debugElement.query(By.css('app-header'));
    expect(headerElement).toBeTruthy();
    expect(headerElement.nativeElement.textContent).toContain('Mock Header');
  });

  it('should render router-outlet', () => {
    const routerOutletElement = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutletElement).toBeTruthy();
  });
});
