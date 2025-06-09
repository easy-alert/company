import { IMaintenance, AnnexesAndImages } from '../../types';

export interface IModalEditMaintenanceReport {
  maintenanceHistoryId: string;
  handleModalEditReport: (modalState: boolean) => void;
  onThenActionRequest: () => Promise<void>;
}

export interface IMaintenanceReport {
  cost: string;
  observation: string;
  id: string;
}

export interface IRequestEditReport {
  maintenanceHistoryId: string;
  maintenanceReport: IMaintenanceReport;
  handleModalEditReport: (modalState: boolean) => void;
  setOnModalQuery: (setOnModalQuery: boolean) => void;
  files: AnnexesAndImages[];
  images: AnnexesAndImages[];
  origin: 'Backoffice' | 'Company' | 'Client';
  onThenRequest: () => Promise<void>;
}

export interface IRequestMaintenanceDetailsForEdit {
  maintenanceHistoryId: string;
  setModalLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMaintenance: React.Dispatch<React.SetStateAction<IMaintenance>>;
  setMaintenanceReport: React.Dispatch<React.SetStateAction<IMaintenanceReport>>;
  setFiles: React.Dispatch<React.SetStateAction<AnnexesAndImages[]>>;
  setImages: React.Dispatch<React.SetStateAction<AnnexesAndImages[]>>;
}
