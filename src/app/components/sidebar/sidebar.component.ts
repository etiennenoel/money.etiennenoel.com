import {Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {BaseComponent} from '../base/base.component';
import {ToastStore} from '../../stores/toast.store';
import {DOCUMENT, isPlatformServer} from '@angular/common';
import {RouteEnum} from '../../enums/route.enum';
import {Router} from '@angular/router';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  standalone: false,
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent extends BaseComponent implements OnInit {

  @Input()
  sidebarCollapsed = false;

  @Output()
  sidebarCollapsedChange = new EventEmitter<boolean>();

  currentRoute: RouteEnum = RouteEnum.Home;

  constructor(
    private readonly toastStore: ToastStore,
    @Inject(DOCUMENT) document: Document,
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly router: Router,
  ) {
    super(document);
  }

  override ngOnInit() {
    super.ngOnInit();

    this.subscriptions.push(this.router.events.subscribe(value => {
      if (value && value.constructor.name === 'NavigationEnd') {
        this.updateRoute();
      }
    }))

    this.updateRoute();

    if(isPlatformServer(this.platformId)) {
      return;
    }

    // Restore sidebar state from local storage
    const storedSidebarState = localStorage.getItem('sidebarCollapsed');
    if(storedSidebarState !== null && storedSidebarState === 'true') {
      this.sidebarCollapsed = true;
      this.sidebarCollapsedChange.emit(this.sidebarCollapsed);
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.sidebarCollapsedChange.emit(this.sidebarCollapsed);

    if(isPlatformServer(this.platformId)) {
      return;
    }
    // Save sidebar state to local storage
    localStorage.setItem('sidebarCollapsed', String(this.sidebarCollapsed));
  }



  updateRoute() {
    if(!this.window) {
      return;
    }

    const url = this.window.location.pathname;

    if(url === "") {
      this.currentRoute = RouteEnum.Home;
    } else {
      this.currentRoute = url as RouteEnum;
    }
  }

  protected readonly RouteEnum = RouteEnum;
}
