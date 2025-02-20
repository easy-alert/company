import { AnnexesAndImages } from '../../types';
import { IFilter, IFilterOptions, IKanban } from '../types';
import { IModalAdditionalInformations } from '../../MaintenancesPlan/types';

export interface IModalSendMaintenanceReport {
  userId?: string;
  maintenanceHistoryId: string;
  handleModals: (modal: TModalNames, modalState: boolean) => void;
  handleRefresh: () => void;
}

export interface IMaintenanceReport {
  cost: string;
  observation: string;
}

export interface IRequestSendReport {
  maintenanceReport: IMaintenanceReport;
  maintenanceHistoryId: string;
  files: AnnexesAndImages[];
  images: AnnexesAndImages[];
  syndicNanoId: string;
}

export interface IRequestToggleInProgress {
  maintenanceHistoryId: string;
  syndicNanoId: string;
  inProgressChange: boolean;
}

export interface IRequestReportProgress {
  maintenanceHistoryId: string;
}

export interface IRequestSaveReportProgress {
  maintenanceReport: IMaintenanceReport;
  maintenanceHistoryId: string;
  files: AnnexesAndImages[];
  images: AnnexesAndImages[];
  syndicNanoId: string;
}
