import { IMaintenance, AnnexesAndImages } from '../../types';

export interface IModalSendMaintenanceReport {
  setModal: (setModal: boolean) => void;
  maintenanceHistoryId: string;
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

export interface IRequestMaintenanceDetails {
  maintenanceHistoryId: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMaintenance: React.Dispatch<React.SetStateAction<IMaintenance>>;
}

export interface IMaintenanceReport {
  cost: string;
  observation: string;
}

export interface IRequestSendReport {
  maintenanceHistoryId: string;
  maintenanceReport: IMaintenanceReport;
  setModal: (setModal: boolean) => void;
  files: AnnexesAndImages[];
  images: AnnexesAndImages[];
}
