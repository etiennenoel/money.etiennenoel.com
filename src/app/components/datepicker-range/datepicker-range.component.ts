import {Component, Inject, Input, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {BaseComponent} from '../base/base.component';
import {ToastStore} from '../../stores/toast.store';
import {DOCUMENT} from '@angular/common';
import {ToastMessageInterface} from '../../interfaces/toast-message.interface';
import {delay, pipe} from 'rxjs';
import {NgbCalendar, NgbDate, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-datepicker-range',
  templateUrl: './datepicker-range.component.html',
  standalone: false,
  styleUrl: './datepicker-range.component.scss'
})
export class DatepickerRangeComponent extends BaseComponent implements OnInit {
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  constructor(
    @Inject(DOCUMENT) document: Document,
    private readonly calendar: NgbCalendar,
    public readonly formatter: NgbDateParserFormatter,
  ) {
    super(document);

    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 10);
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
}
