import {AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {BaseComponent} from '../base/base.component';
import {DateRangeInterface} from "../../interfaces/date-range.interface";
import {ToastStore} from '../../stores/toast.store';
import {DOCUMENT} from '@angular/common';
import {ToastMessageInterface} from '../../interfaces/toast-message.interface';
import {delay, pipe} from 'rxjs';
import {NgbCalendar, NgbDate, NgbDateParserFormatter, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-datepicker-range',
  templateUrl: './datepicker-range.component.html',
  standalone: false,
  styleUrl: './datepicker-range.component.scss'
})
export class DatepickerRangeComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('datepicker', { static: false }) datepicker!: NgbInputDatepicker;
  @Output() rangeSelected = new EventEmitter<DateRangeInterface>();
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

  ngAfterViewInit() {
    this.emitRangeSelectedEvent();
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
    this.emitRangeSelectedEvent();
  }

  private emitRangeSelectedEvent(): void {
    if (this.fromDate && this.toDate) {
      const fromDate = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day);
      const toDate = new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day);
      this.rangeSelected.emit({ fromDate, toDate });
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

  get formattedRange(): string {
    if (this.fromDate && this.toDate) {
      return `${this.formatter.format(this.fromDate)} - ${this.formatter.format(this.toDate)}`;
    } else if (this.fromDate) {
      return this.formatter.format(this.fromDate);
    } else {
      return 'Select Date Range';
    }
  }

  selectPredefinedRange(range: string): void {
    const today = this.calendar.getToday();
    let fromDate: NgbDate = today;
    let toDate: NgbDate = today;

    switch (range) {
      case 'Today':
        // fromDate and toDate are already set to today
        break;
      case 'Yesterday':
        fromDate = this.calendar.getPrev(today, 'd', 1);
        toDate = fromDate;
        break;
      case 'This Week':
        // Assuming getWeekday returns 1 for Monday, 7 for Sunday.
        // We want Sunday to Saturday.
        const currentWeekday = this.calendar.getWeekday(today); // 1 (Mon) to 7 (Sun)
        fromDate = this.calendar.getNext(today, 'd', -(currentWeekday % 7)); // Sunday
        toDate = this.calendar.getNext(fromDate, 'd', 6); // Saturday
        break;
      case 'Last Week':
        const currentWeekdayLW = this.calendar.getWeekday(today);
        const sundayThisWeek = this.calendar.getNext(today, 'd', -(currentWeekdayLW % 7));
        fromDate = this.calendar.getPrev(sundayThisWeek, 'd', 7); // Sunday of last week
        toDate = this.calendar.getPrev(sundayThisWeek, 'd', 1); // Saturday of last week
        break;
      case 'This Month':
        fromDate = new NgbDate(today.year, today.month, 1);
        const nextMonth = this.calendar.getNext(today, 'm', 1);
        toDate = this.calendar.getPrev(new NgbDate(nextMonth.year, nextMonth.month, 1), 'd', 1);
        break;
      case 'Last Month':
        const prevMonth = this.calendar.getPrev(today, 'm', 1);
        fromDate = new NgbDate(prevMonth.year, prevMonth.month, 1);
        const thisMonthFirstDay = new NgbDate(today.year, today.month, 1);
        toDate = this.calendar.getPrev(thisMonthFirstDay, 'd', 1);
        break;
      case 'This Year':
        fromDate = new NgbDate(today.year, 1, 1);
        toDate = new NgbDate(today.year, 12, 31);
        break;
      case 'Last Year':
        const prevYear = today.year - 1;
        fromDate = new NgbDate(prevYear, 1, 1);
        toDate = new NgbDate(prevYear, 12, 31);
        break;
      default:
        // Should not happen with predefined values
        return;
    }

    this.fromDate = fromDate;
    this.toDate = toDate;
    this.hoveredDate = null;
    this.emitRangeSelectedEvent();
  }

  openCustomDatepicker(): void {
    if (this.datepicker) {
      this.datepicker.toggle();
    }
  }
}
