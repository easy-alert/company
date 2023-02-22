import { IBuildingDetail, INotificationConfiguration } from '../../../types';

interface IEditNotificationConfiguration {
  name: string;
  email: string;
  role: string;
  contactNumber: string;
  isMain: boolean;
}

export interface IModalEditNotificationConfiguration {
  setModal: (setModal: boolean) => void;
  buildingId: string;
  setBuilding: (setBuilding: IBuildingDetail) => void;
  selectedNotificationRow: INotificationConfiguration;
  setUsedMaintenancesCount: (setUsedMaintenancesCount: number) => void;
  setTotalMaintenancesCount: (setTotalMaintenancesCount: number) => void;
  phoneConfirmUrl: string;
  emailConfirmUrl: string;
}

// REQUESTS
export interface IRequestEditNotificationConfiguration {
  values: IEditNotificationConfiguration;
  buildingId: string;
  buildingNotificationConfigurationId: string;
  setOnQuery: (setOnQuery: boolean) => void;
  setModal: (setModal: boolean) => void;
  setBuilding: (setBuilding: IBuildingDetail) => void;
  setUsedMaintenancesCount: (setUsedMaintenancesCount: number) => void;
  setTotalMaintenancesCount: (setTotalMaintenancesCount: number) => void;
  phoneConfirmUrl: string;
  emailConfirmUrl: string;
}

export interface IRequestDeleteNotificationConfiguration {
  setOnQuery: (setOnQuery: boolean) => void;
  setModal: (setModal: boolean) => void;
  buildingNotificationConfigurationId: string;
  buildingId: string;
  setBuilding: (setBuilding: IBuildingDetail) => void;
  setUsedMaintenancesCount: (setUsedMaintenancesCount: number) => void;
  setTotalMaintenancesCount: (setTotalMaintenancesCount: number) => void;
}
