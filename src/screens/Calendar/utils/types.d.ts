import { IEventTag } from './EventTag/types';

export interface ICalendarView extends IEventTag {
  start: Date;
  end: Date;
  id: string;
  title: string | JSX.Element;
}

export interface IRequestCalendarData {
  setMaintenancesWeekView: (setMaintenancesWeekView: ICalendarView[]) => void;
  setMaintenancesMonthView: (setMaintenancesMonthView: ICalendarView[]) => void;
  setMaintenancesDisplay: (setMaintenancesDisplay: ICalendarView[]) => void;
  setLoading: (setLoading: boolean) => void;
}

export interface IRequestCalendarDataResData {
  MaintenancesStatus: {
    name: string;
  };
}
