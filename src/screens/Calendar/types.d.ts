export interface ICalendarView {
  start: Date;
  end: Date;
  id: string;
  title: string | JSX.Element;
  status: 'expired' | 'pending' | 'completed' | 'overdue';
  expectedDueDate?: string;
  expectedNotificationDate?: string;
}

export interface IBuildingOptions {
  name: string;
  id: string;
}

export interface IModalAdditionalInformations {
  id: string;
  isFuture: boolean;
  expectedNotificationDate: string;
  expectedDueDate: string;
}

export interface IRequestCalendarData {
  setMaintenancesWeekView: (setMaintenancesWeekView: ICalendarView[]) => void;
  setMaintenancesMonthView: (setMaintenancesMonthView: ICalendarView[]) => void;
  setMaintenancesDisplay: (setMaintenancesDisplay: ICalendarView[]) => void;
  setLoading: (setLoading: boolean) => void;
  setYearChangeLoading: (setYearChangeLoading: boolean) => void;
  yearToRequest: number;
  setBuildingOptions: React.Dispatch<React.SetStateAction<IBuildingOptions[]>>;
  buildingId: string;
  calendarType: 'month' | 'week' | 'work_week' | 'day' | 'agenda';
}

export interface IRequestCalendarDataResData {
  data: {
    Filter: IBuildingOptions[];

    Dates: {
      Weeks: [
        {
          inProgress: boolean;
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
          notificationDate: string;
          isFuture: boolean;
          id: string;
          expectedDueDate: string;
          expectedNotificationDate: string;
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

export interface AnnexesAndImages {
  name: string;
  originalName: string;
  url: string;
}

export interface MaintenanceReport {
  id: string;
  cost: number;
  observation: string;
  ReportAnnexes: AnnexesAndImages[];
  ReportImages: AnnexesAndImages[];
}

export interface MaintenancesStatus {
  name: 'expired' | 'pending' | 'completed' | 'overdue';
}

export interface Building {
  name: string;
}

export interface Category {
  name: string;
}

export interface Maintenance {
  Category: Category;
  activity: string;
  element: string;
  observation: string;
  responsible: string;
  source: string;
  frequency: number;
  FrequencyTimeInterval: {
    pluralLabel: string;
    singularLabel: string;
  };
  MaintenanceType: {
    name: string;
  };
  instructions: {
    name: string;
    url: string;
  }[];
}

export interface IMaintenance {
  id: string;
  dueDate: string;
  resolutionDate: string;
  notificationDate: string;
  MaintenanceReport: MaintenanceReport[];
  MaintenancesStatus: MaintenancesStatus;
  Building: Building;
  Maintenance: Maintenance;
  canReport: boolean;
  inProgress: boolean;
  daysInAdvance: number;
}
