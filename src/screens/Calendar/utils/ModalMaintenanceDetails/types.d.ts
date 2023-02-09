import { IMaintenance } from '../../types';

export interface IModalMaintenanceDetails {
  setModal: (setModal: boolean) => void;
  maintenanceHistoryId: string;
}

export interface IRequestMaintenanceDetails {
  maintenanceHistoryId: string;
  setModalLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMaintenance: React.Dispatch<React.SetStateAction<IMaintenance>>;
}
