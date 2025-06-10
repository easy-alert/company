import type { IAnnexesAndImages } from '@customTypes/IAnnexesAndImages';
import type { IMaintenance } from '@customTypes/IMaintenance';
import type {
  IMaintenanceReport,
  IMaintenanceReportProgress,
} from '@customTypes/IMaintenanceReport';

import type { TOrigin } from '@utils/types';

export interface IModalEditMaintenanceReport {
  maintenanceHistoryId: string;
  handleModalEditReport: (modalState: boolean) => void;
  handleBackgroundData: () => Promise<void>;
}

export interface IRequestEditReport {
  maintenanceHistoryId: string;
  maintenanceReport: IMaintenanceReportProgress;
  files: IAnnexesAndImages[];
  images: IAnnexesAndImages[];
  origin: TOrigin;
  handleModalEditReport: (modalState: boolean) => void;
  setOnModalQuery: (setOnModalQuery: boolean) => void;
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

export interface IRequestDeleteMaintenanceHistory {
  maintenanceHistoryId: string;
  onThenRequest: () => Promise<void>;
  setOnModalQuery: React.Dispatch<React.SetStateAction<boolean>>;
  handleModalSendMaintenanceReport?: (modalState: boolean) => void;
  handleModalEditReport?: (modalState: boolean) => void;
}
