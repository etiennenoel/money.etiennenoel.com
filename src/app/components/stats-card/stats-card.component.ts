import {Component, Inject, Input, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {BaseComponent} from '../base/base.component';
import {ToastStore} from '../../stores/toast.store';
import {DOCUMENT} from '@angular/common';
import {ToastMessageInterface} from '../../interfaces/toast-message.interface';
import {delay, pipe} from 'rxjs';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  standalone: false,
  styleUrl: './stats-card.component.scss'
})
export class StatsCardComponent extends BaseComponent implements OnInit {

  @Input()
  title: string = '';

  @Input()
  currentPeriodValue: string|null = '';

  @Input()
  previousPeriodValue: string|null = '';

  @Input()
  percentageDifference: string|null = '';

  @Input()
  trendDirection?: 'up' | 'down';

  @Input()
  trendSentiment?: "positive" | "negative"

  constructor(
    @Inject(DOCUMENT) document: Document,
  ) {
    super(document);
  }

  override ngOnInit() {
    super.ngOnInit();
  }
}
