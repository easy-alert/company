import type { IMaintenance } from '@customTypes/IMaintenance';

export interface IModalAdditionalInformations {
  id: string;
  isFuture: boolean;
  expectedNotificationDate: string;
  expectedDueDate: string;
}

export interface IModalMaintenanceDetails {
  modalAdditionalInformations: IModalAdditionalInformations;
  handleModalMaintenanceDetails: (modalState: boolean) => void;
  handleModalEditReport: (modalState: boolean) => void;
}

export interface IRequestMaintenanceDetails {
  maintenanceHistoryId: string;
  setModalLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMaintenance: React.Dispatch<React.SetStateAction<IMaintenance>>;
}
