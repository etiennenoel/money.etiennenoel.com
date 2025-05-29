import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render navigation links', () => {
    const navElement = fixture.debugElement.query(By.css('nav.sidebar-nav'));
    expect(navElement).toBeTruthy();
    const links = fixture.debugElement.queryAll(By.css('a.nav-link'));
    expect(links.length).toBeGreaterThan(0); // Expect at least one nav link
    // Check for specific links if necessary
    const expensesLink = links.find(link => link.nativeElement.textContent.includes('Expenses'));
    expect(expensesLink).toBeTruthy();
  });
});
