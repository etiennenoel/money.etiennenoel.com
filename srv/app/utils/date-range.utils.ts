import { DateRangeInterface } from '../../interfaces/date-range.interface';

export class DateRangeUtils {
  public static getPreviousRange(dateRange: DateRangeInterface): DateRangeInterface {
    const fromDate = new Date(dateRange.fromDate);
    const toDate = new Date(dateRange.toDate);

    const duration = toDate.getTime() - fromDate.getTime();

    const previousToDate = new Date(fromDate.getTime() - 1); // Subtract 1 millisecond to get the day before the current range starts
    const previousFromDate = new Date(previousToDate.getTime() - duration);

    return {
      fromDate: previousFromDate,
      toDate: previousToDate,
    };
  }
}
