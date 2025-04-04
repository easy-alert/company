import { AnnexesAndImages } from '../../types';
import { IFilter, IFilterOptions, IKanban } from '../types';
import { IModalAdditionalInformations } from '../../MaintenancesPlan/types';

export interface IModalSendMaintenanceReport {
  userId?: string;
  maintenanceHistoryId: string;
  refresh: boolean;
  handleModals: (modal: TModalNames, modalState: boolean) => void;
  handleRefresh: () => void;
}

export interface IMaintenanceReport {
  cost: string;
  observation: string;
}

export interface IRequestSendReport {
  syndicNanoId: string;
  userId: string;
  maintenanceHistoryId: string;
  maintenanceReport: IMaintenanceReport;
  files: AnnexesAndImages[];
  images: AnnexesAndImages[];
}

export interface IRequestToggleInProgress {
  syndicNanoId: string;
  userId: string;
  userId: string;
  maintenanceHistoryId: string;
  inProgressChange: boolean;
}

export interface IRequestReportProgress {
  maintenanceHistoryId: string;
}

export interface IRequestSaveReportProgress {
  syndicNanoId: string;
  userId: string;
  maintenanceHistoryId: string;
  maintenanceReport: IMaintenanceReport;
  files: AnnexesAndImages[];
  images: AnnexesAndImages[];
}
