import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CalendarService } from '../../services/calendar.service';
import { Subject, takeUntil } from 'rxjs';
import { DayOfWeek } from '../../month.types';

@Component({
  selector: 'app-filter-component',
  templateUrl: 'filter.component.html',
})
export class FilterComponent implements OnInit, OnDestroy {
  daysOfWeek: DayOfWeek[] = [
    { id: 1, name: 'Monday', isChecked: true },
    { id: 2, name: 'Tuesday', isChecked: true },
    { id: 3, name: 'wednesday', isChecked: true },
    { id: 4, name: 'thursday', isChecked: true },
    { id: 5, name: 'Friday', isChecked: true },
    { id: 6, name: 'Saturday', isChecked: true },
    { id: 0, name: 'Sunday', isChecked: true },
  ];
  filterForm: FormGroup | undefined;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private formBuilder: FormBuilder,
    private calendarService: CalendarService
  ) {}

  ngOnInit(): void  {
    this.initFormControl();
    // fill the formArray with the daysOfWeek
    this.populateForm();
  }

  initFormControl(): void {
    this.filterForm = this.formBuilder.group({
      startDate: [''],
      endDate: [''],
      daysOfWeek: this.formBuilder.array([]),
    });
  }
  watchFormControlChanges(): void  {
    this.filterForm?.valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((filter) => {
        this.calendarService.getDatesInRange(filter);
      });
  }

  /**
   * Create a FormGroup for each checkbox
   * @param dayOfWeek day of the week data for the initialization
   * @return {FormGroup}
   */
  createDayOfWeekForm(dayOfWeek: DayOfWeek): FormGroup {
    return this.formBuilder.group({
      id: [dayOfWeek.id],
      name: [dayOfWeek.name],
      isChecked: [dayOfWeek.isChecked],
    });
  }
  /**
   * Get the list of the days of the week as a formArray
   * @return {FormArray}
   */
  getDaysOfWeek(): FormArray {
    return this.filterForm?.get('daysOfWeek') as FormArray;
  }
  /**
   *  add a new day to the formArray
   *  @param dayOfWeek day of the week data for the initialization
   */
  addDay(dayOfWeek: DayOfWeek): void {
    this.getDaysOfWeek().push(this.createDayOfWeekForm(dayOfWeek));
  }
  populateForm(): void  {
    this.daysOfWeek.forEach((dayOfWeek, index) => {
      this.addDay(dayOfWeek);
    });
  }

  save(): void  {
    // call this method to notify the subscribers that the form has been changed
    this.calendarService.getDatesInRange(this.filterForm?.value);
    this.watchFormControlChanges();
    // this.onRenderMonth(this.event);
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
}
