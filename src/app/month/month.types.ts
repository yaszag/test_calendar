export interface DayOfWeek {
  id: number;
  name: string;
  isChecked: boolean;
}
export interface CalendarDays {
  key: string;
  elem: Element[];
  events: [];
}
export interface DateInRange {
  key: string;
  date: string;
  isSwitched: boolean;
}
