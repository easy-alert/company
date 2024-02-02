import { IMaintenanceReportData } from '../types';

import { IMaintenance } from '../../../Calendar/types';

export interface IModalSendMaintenanceReport {
  setModal: (setModal: boolean) => void;
  maintenanceHistoryId: string;
  onThenActionRequest: () => Promise<void>;

  setOnQuery: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCounts: React.Dispatch<React.SetStateAction<ICounts>>;
  setMaintenances: React.Dispatch<React.SetStateAction<IMaintenanceReportData[]>>;
  filters: IFilterforRequest;
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
  maintenanceReport: IMaintenanceReport;
  setModal: (setModal: boolean) => void;
  maintenanceHistoryId: string;
  files: AnnexesAndImages[];
  images: AnnexesAndImages[];
  setOnModalQuery: (setOnModalQuery: boolean) => void;
  origin: 'Backoffice' | 'Company' | 'Client';

  setOnQuery: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCounts: React.Dispatch<React.SetStateAction<ICounts>>;
  setMaintenances: React.Dispatch<React.SetStateAction<IMaintenanceReportData[]>>;
  filters: IFilterforRequest;
}

export interface IRequestReportProgress {
  maintenanceHistoryId: string;
  setFiles: React.Dispatch<React.SetStateAction<AnnexesAndImages[]>>;
  setImages: React.Dispatch<React.SetStateAction<AnnexesAndImages[]>>;
  setMaintenanceReport: React.Dispatch<React.SetStateAction<IMaintenanceReport>>;
}

export interface IRequestSaveReportProgress {
  maintenanceReport: IMaintenanceReport;
  setModal: (setModal: boolean) => void;
  maintenanceHistoryId: string;
  files: AnnexesAndImages[];
  images: AnnexesAndImages[];
  setOnModalQuery: (setOnModalQuery: boolean) => void;
  onThenActionRequest: () => Promise<void>;
}
