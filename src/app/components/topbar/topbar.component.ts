import {Component, Inject, Input, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {BaseComponent} from '../base/base.component';
import {ToastStore} from '../../stores/toast.store';
import {DOCUMENT} from '@angular/common';
import {ToastMessageInterface} from '../../interfaces/toast-message.interface';
import {delay, pipe} from 'rxjs';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  standalone: false,
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent extends BaseComponent implements OnInit {

  constructor(
    private readonly toastStore: ToastStore,
    @Inject(DOCUMENT) document: Document,
  ) {
    super(document);
  }

  override ngOnInit() {
    super.ngOnInit();
  }
}
