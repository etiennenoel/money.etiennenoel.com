import {Component, Inject, Input, OnInit} from '@angular/core';
import {BaseComponent} from '../base/base.component';
import {ToastStore} from '../../stores/toast.store';
import {DOCUMENT} from '@angular/common';

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
