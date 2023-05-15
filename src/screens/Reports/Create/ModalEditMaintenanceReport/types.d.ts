import { IMaintenance, AnnexesAndImages } from '../../types';

export interface IModalSendMaintenanceReport {
  setModal: (setModal: boolean) => void;
  maintenanceHistoryId: string;
}

export interface IMaintenanceReport {
  cost: string;
  observation: string;
  id: string;
}

export interface IRequestSendReport {
  maintenanceHistoryId: string;
  maintenanceReport: IMaintenanceReport;
  setModal: (setModal: boolean) => void;
  setOnQuery: (setOnQuery: boolean) => void;
  files: AnnexesAndImages[];
  images: AnnexesAndImages[];
  origin: 'Backoffice' | 'Company' | 'Client';
}

export interface IRequestMaintenanceDetailsForEdit {
  maintenanceHistoryId: string;
  setModalLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMaintenance: React.Dispatch<React.SetStateAction<IMaintenance>>;
  setMaintenanceReport: React.Dispatch<React.SetStateAction<IMaintenanceReport>>;
  setFiles: React.Dispatch<React.SetStateAction<AnnexesAndImages[]>>;
  setImages: React.Dispatch<React.SetStateAction<AnnexesAndImages[]>>;
}
