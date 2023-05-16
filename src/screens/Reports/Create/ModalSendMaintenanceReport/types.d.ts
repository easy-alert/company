import { IMaintenance, AnnexesAndImages } from '../../types';

export interface IModalSendMaintenanceReport {
  setModal: (setModal: boolean) => void;
  maintenanceHistoryId: string;
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
  setOnQuery: (setOnQuery: boolean) => void;
  origin: 'Backoffice' | 'Company' | 'Client';
}
