import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CalendarDays, DateInRange, DayOfWeek } from '../month.types';
@Injectable({ providedIn: 'root' })
export class CalendarService {
  datesInRangeSubject = new BehaviorSubject<DateInRange[]>([]);

  constructor() {}

  /**
   * Get the list of dates in the range specified as an observable .
   */
  get datesInRangeObservable$() {
    return this.datesInRangeSubject.asObservable();
  }

  /**
   * Get the list of dates from reactive form and return the list of the dates between start-date and end-date .
   * @param filter : The
   */
  getDatesInRange(filter: any): DateInRange[] {
    const d1 = new Date(filter.startDate);
    const d2 = new Date(filter.endDate);
    const date = new Date(d1);

    const dates = [];

    //map date list and push each into dates array after formatted
    while (date < d2) {
      dates.push(this.formatDate(new Date(date), filter.daysOfWeek));
      date.setDate(date.getDate() + 1);
    }
    // fire an event for all subscribers
    this.datesInRangeSubject.next(dates);
    return dates;
  }

  /**
   * Get the list of dates shown in the calendar and apply an event to each date in the range
   * ? Here is choose to change the background color, we can add other things. Also we can use the sohoCalendarEvent it depend on requirements.
   * @param dayMap :all calendar days shown in the calendar
   * @param datesInRange {DateInRange} : the range of dates choosen by the user
   */
  fillCalendar(dayMap: CalendarDays[], datesInRange: DateInRange[]): void {
    dayMap.forEach((element: CalendarDays) => {
      // we need to clear the calendar every view change
      this.clearCalendar(element);
      // check if the given date is in range
      const inRange = datesInRange.some((range) => range.key == element.key);
      // get current day to know if we can apply our event
      const matchday = datesInRange.find((day) => day.key == element.key);
      if (inRange && matchday?.isSwitched) {
        element.elem[0].classList.add('bg-color');
      }
    });
  }

  /**
   * Remove Background from Calendar .
   */
  private clearCalendar(element: any): void {
    element.elem[0].classList.remove('bg-color');
  }

  /**
   * Helper to tranfsorm the date .
   */
  private padTo2Digits(num: any) {
    return num.toString().padStart(2, '0');
  }

  /**
   * Date formatter .
   * @param date date to be formatted
   * @param daysOfWeek list of days for the verification
   * @return {DateInRange} Object
   */
  private formatDate(date: Date, daysOfWeek: any[]): DateInRange {
    return {
      key: this.transformDate(date),
      date: this.transformDate(date, '-'),
      isSwitched: this.isSwitchedVerify(date, daysOfWeek),
    };
  }

  /**
   * Date formatter .
   * @param date date to be transform
   * @param key for the date attribute we need to join them with '-'
   * @return date as string
   */
  private transformDate(date: Date, key = ''): string {
    return [
      date.getFullYear(),
      this.padTo2Digits(date.getMonth() + 1),
      this.padTo2Digits(date.getDate()),
    ].join(key);
  }

  /**
   * verification if the day is checked or not
   * @param date current date
   * @param daysOfWeek list of days of week that should be checked
   * @return {boolean}
   */
  private isSwitchedVerify(date: Date, daysOfWeek: DayOfWeek[]): boolean {
    const unCheckedDates: DayOfWeek[] = daysOfWeek
      .filter((s: any) => s.isChecked == false)
      .map((d: any) => d.id);
    return ![0, 6, ...unCheckedDates].some((x) => x == date.getDay());
  }
}
