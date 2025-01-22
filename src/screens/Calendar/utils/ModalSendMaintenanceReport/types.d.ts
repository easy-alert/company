import type { IMaintenance } from '@customTypes/IMaintenance';

import type { AnnexesAndImages, IModalAdditionalInformations } from '../../types';

export interface IModalSendMaintenanceReport {
  handleModalSendMaintenanceReport: (modalState: boolean) => void;
  modalAdditionalInformations: IModalAdditionalInformations;
  setMaintenancesWeekView: (setMaintenancesWeekView: ICalendarView[]) => void;
  setMaintenancesMonthView: (setMaintenancesMonthView: ICalendarView[]) => void;
  setMaintenancesDisplay: (setMaintenancesDisplay: ICalendarView[]) => void;
  setLoading: (setLoading: boolean) => void;
  setYearChangeLoading: (setYearChangeLoading: boolean) => void;
  yearToRequest: number;
  setBuildingOptions: React.Dispatch<React.SetStateAction<IBuildingOptions[]>>;
  buildingId: string;
  calendarType: 'month' | 'week' | 'work_week' | 'day' | 'agenda';
  onThenActionRequest: () => Promise<void>;
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
  handleModalSendMaintenanceReport: (modalState: boolean) => void;
  setOnQuery: (setOnQuery: boolean) => void;
  files: AnnexesAndImages[];
  images: AnnexesAndImages[];
  setMaintenancesWeekView: (setMaintenancesWeekView: ICalendarView[]) => void;
  setMaintenancesMonthView: (setMaintenancesMonthView: ICalendarView[]) => void;
  setMaintenancesDisplay: (setMaintenancesDisplay: ICalendarView[]) => void;
  setLoading: (setLoading: boolean) => void;
  setYearChangeLoading: (setYearChangeLoading: boolean) => void;
  yearToRequest: number;
  setBuildingOptions: React.Dispatch<React.SetStateAction<IBuildingOptions[]>>;
  buildingId: string;
  calendarType: 'month' | 'week' | 'work_week' | 'day' | 'agenda';
  origin: 'Backoffice' | 'Company' | 'Client';
}

export interface IRequestSaveReportProgress {
  maintenanceHistoryId: string;
  maintenanceReport: IMaintenanceReport;
  maintenance: IMaintenance;
  handleModalSendMaintenanceReport: (modalState: boolean) => void;
  setOnQuery: (setOnQuery: boolean) => void;
  files: AnnexesAndImages[];
  images: AnnexesAndImages[];
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

export interface IRequestToggleInProgress {
  handleModalSendMaintenanceReport: (modalState: boolean) => void;
  maintenanceHistoryId: string;
  setOnQuery: React.Dispatch<React.SetStateAction<boolean>>;
  inProgressChange: boolean;
  onThenActionRequest: () => Promise<void>;
}

export interface IRequestReportProgress {
  maintenanceHistoryId: string;
  setFiles: React.Dispatch<React.SetStateAction<AnnexesAndImages[]>>;
  setImages: React.Dispatch<React.SetStateAction<AnnexesAndImages[]>>;
  setMaintenanceReport: React.Dispatch<React.SetStateAction<IMaintenanceReport>>;
}
