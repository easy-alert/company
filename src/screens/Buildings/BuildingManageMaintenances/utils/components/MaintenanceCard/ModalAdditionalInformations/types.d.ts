import { ICategories, IMaintenance } from '../../../types';
import {
  IMaintenanceReport,
  AnnexesAndImages,
} from '../../../../../../Calendar/utils/ModalSendMaintenanceReport/types';

export interface IModalAdditionalInformations {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
  maintenanceIndex: number;
  categoryIndex: number;
  selectedMaintenance: IMaintenance;
}

export interface IHandleAdditionalInformations {
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
  values: {
    hasLastResolutionDate: boolean;
    lastResolutionDate: string;
    hasFirstNotificationDate: boolean;
    firstNotificationDate: string;
  };
  maintenanceIndex: number;
  categoryIndex: number;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  maintenanceReport: IMaintenanceReport;
  files: AnnexesAndImages[];
  images: AnnexesAndImages[];
}
