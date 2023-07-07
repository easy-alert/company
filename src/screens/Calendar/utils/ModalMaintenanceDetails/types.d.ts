import { IMaintenance } from '../../types';

export interface IModalAdditionalInformations {
  id: string;
  isFuture: boolean;
  expectedNotificationDate: string;
  expectedDueDate: string;
}

export interface IModalMaintenanceDetails {
  setModal: (setModal: boolean) => void;
  setModalEditReport: (setModal: boolean) => void;
  modalAdditionalInformations: IModalAdditionalInformations;
}

export interface IRequestMaintenanceDetails {
  maintenanceHistoryId: string;
  setModalLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMaintenance: React.Dispatch<React.SetStateAction<IMaintenance>>;
}
