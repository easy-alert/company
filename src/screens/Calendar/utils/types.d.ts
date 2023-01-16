export interface ICalendarView {
  start: Date;
  end: Date;
  id: string;
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
    Dates: [
      {
        MaintenancesStatus: {
          name: 'expired' | 'pending' | 'completed' | 'overdue';
          pluralLabel: string;
          singularLabel: string;
        };
        Building: {
          name: string;
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
  };
}
