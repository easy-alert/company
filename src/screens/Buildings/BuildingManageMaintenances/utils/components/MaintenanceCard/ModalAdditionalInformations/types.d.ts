import { ICategories, IMaintenance } from '../../../types';
import {
  IMaintenanceReport,
  AnnexesAndImages,
} from '../../../../../../Calendar/utils/ModalSendMaintenanceReport/types';

export interface IModalAdditionalInformations {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
  categories: ICategories[];
  maintenanceIndex: number;
  categoryIndex: number;
  selectedMaintenance: IMaintenance;
  hasHistory: boolean;
  canAnticipate: boolean;
  maxDaysToAnticipate: number;
}

export interface IHandleAdditionalInformations {
  categories: ICategories[];
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
  values: {
    hasLastResolutionDate: boolean;
    lastResolutionDate: string;
    hasFirstNotificationDate: boolean;
    firstNotificationDate: string;
    daysToAnticipate: number;
    status: string;
  };
  maintenanceIndex: number;
  categoryIndex: number;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  maintenanceReport: IMaintenanceReport;
  files: AnnexesAndImages[];
  images: AnnexesAndImages[];
  selectedMaintenance: IMaintenance;
}
