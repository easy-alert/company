import { IMaintenance, AnnexesAndImages } from '../../types';
import { IMaintenanceReportData, IFilterforRequest } from '../types';

export interface IModalEditMaintenanceReport {
  setModal: (setModal: boolean) => void;
  maintenanceHistoryId: string;

  setOnQuery: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCounts: React.Dispatch<React.SetStateAction<ICounts>>;
  setMaintenances: React.Dispatch<React.SetStateAction<IMaintenanceReportData[]>>;
  filters: IFilterforRequest;
}

export interface IMaintenanceReport {
  cost: string;
  observation: string;
  id: string;
}

export interface IRequestEditReport {
  maintenanceHistoryId: string;
  maintenanceReport: IMaintenanceReport;
  setModal: (setModal: boolean) => void;
  setOnModalQuery: (setOnModalQuery: boolean) => void;
  files: AnnexesAndImages[];
  images: AnnexesAndImages[];
  origin: 'Backoffice' | 'Company' | 'Client';

  setOnQuery: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCounts: React.Dispatch<React.SetStateAction<ICounts>>;
  setMaintenances: React.Dispatch<React.SetStateAction<IMaintenanceReportData[]>>;
  filters: IFilterforRequest;
}

export interface IRequestMaintenanceDetailsForEdit {
  maintenanceHistoryId: string;
  setModalLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMaintenance: React.Dispatch<React.SetStateAction<IMaintenance>>;
  setMaintenanceReport: React.Dispatch<React.SetStateAction<IMaintenanceReport>>;
  setFiles: React.Dispatch<React.SetStateAction<AnnexesAndImages[]>>;
  setImages: React.Dispatch<React.SetStateAction<AnnexesAndImages[]>>;
}
