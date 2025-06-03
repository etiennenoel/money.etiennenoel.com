import {Component, Inject, OnInit} from '@angular/core';
import {BaseComponent} from '../base/base.component';
import {ToastStore} from '../../stores/toast.store';
import {DOCUMENT} from '@angular/common';
import {RouteEnum} from '../../enums/route.enum';
import {Router} from '@angular/router';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  standalone: false,
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent extends BaseComponent implements OnInit {

  currentRoute: RouteEnum = RouteEnum.Home;

  constructor(
    private readonly toastStore: ToastStore,
    @Inject(DOCUMENT) document: Document,
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
