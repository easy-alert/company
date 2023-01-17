export interface ICalendarView {
  start: Date;
  end: Date;
  id: string;
  buildingId: string;
  title: string | JSX.Element;
  status: 'expired' | 'pending' | 'completed' | 'overdue';
}

export interface IRequestCalendarData {
  setMaintenancesWeekView: (setMaintenancesWeekView: ICalendarView[]) => void;
  setMaintenancesMonthView: (setMaintenancesMonthView: ICalendarView[]) => void;
  setMaintenancesDisplay: (setMaintenancesDisplay: ICalendarView[]) => void;
  setLoading: (setLoading: boolean) => void;
}

export interface IRequestCalendarDataResData {
  data: {
    Dates: {
      Weeks: [
        {
          MaintenancesStatus: {
            name: 'expired' | 'pending' | 'completed' | 'overdue';
            pluralLabel: string;
            singularLabel: string;
          };
          Building: {
            name: string;
            id: string;
          };
          Maintenance: {
            frequency: number;
            element: string;
            id: string;
            FrequencyTimeInterval: {
              pluralLabel: string;
              singularLabel: string;
            };
          };
          notificationDate: Date;
        },
      ];
      Months: [
        {
          id: string;
          date: string;
          completed: number;
          expired: number;
          pending: number;
        },
      ];
    };
  };
}
