import { Component, HostBinding, ViewChild } from '@angular/core';
// @ts-ignore
import {
  SohoCalendarComponent,
  SohoCheckBoxComponent,
  SohoModalDialogService,
  SohoToastService,
} from 'ids-enterprise-ng';
import { CalendarService } from './services/calendar.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-month',
  templateUrl: 'month.component.html',
})
export class MonthComponent {
  @HostBinding('style.overflow') overflow = 'auto';
  @HostBinding('style.height') height = 'auto';
  @HostBinding('style.display') block = 'block';

  @ViewChild(SohoCalendarComponent)
  sohoCalendarComponent?: SohoCalendarComponent;

  public initialMonth = new Date().getMonth();
  public initialYear = new Date().getFullYear();
  public showViewChanger = true;
  public eventTypes?: [];
  public events?: [];
  public iconTooltip = 'status';
  public eventTooltip = 'comments';
  public disable = {
    dayOfWeek: [0, 6],
  };

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  selectedDay: any = null;
  public onCalendarDateSelectedCallback = (
    _node: Node,
    args: SohoCalendarDateSelectedEvent
  ) => {
    this.selectedDay = args;
    console.log('onCalendarEventSelectedCallback', args.key);
  };

  constructor(
    private toastService: SohoToastService,
    private calendarService: CalendarService,
    private sohoModalDialogService: SohoModalDialogService
  ) {}

  onRenderMonth(event: SohoCalendarRenderMonthEvent) {
    this.calendarService.datesInRangeObservable$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((dates) => {
        this.calendarService.fillCalendar(event.api.dayMap, dates);
      });
  }
  onCalendarDateSelectedCallbacks(event: any) {
    console.log('onRenderMonth', event);
  }

  onCalendarEventContextMenu(event: SohoCalendarEventClickEvent) {
    if (event) {
      this.toastService.show({
        title: 'Calendar Test',
        message: 'Event "' + event?.event?.subject + '" ContextMenu',
      });
      console.log('onEventContextMenu', event);
    }
  }

  dblClick(event: any): void {
    this.openDialog();
  }

  openDialog(_event?: any): void {
    const dialogRef = this.sohoModalDialogService
      .message('<span class="message">Add New Day Legend</span>')
      .buttons([
        {
          text: 'Cancel',
          click: () => {
            dialogRef.close('CANCEL');
          },
        },
        {
          text: 'Submit',
          click: () => {
            this.fillSelectedDate();
            dialogRef.close('SUBMIT');
          },
          isDefault: true,
        },
      ])
      .title('DayLegend')
      .open()
      .afterClose((result: any) => {
        // this.closeResult = result;
      });
  }
  /**
   * Get the current day and create an event
   * ? Here we can add an event only in the range and where the day is switched to off. 
   * @return {FormArray}
   */
  fillSelectedDate(): void {
    const datesInRange = this.calendarService.datesInRangeSubject.value;
    const newArr = datesInRange.map((date: any) => {
      if (date.key === this.selectedDay.key) {
        return { ...date, isSwitched: true };
      }
      return date;
    });
    this.calendarService.datesInRangeSubject.next(newArr);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
}
