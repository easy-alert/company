import { TOrigin } from '@utils/types';
import { AnnexesAndImages } from '../../types';

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
  origin: 'Company' | 'Backoffice' | 'Client' | 'App';
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
  origin: TOrigin;
}
