import { IBuildingDetail } from '../../../types';

interface ICreateNotificationConfiguration {
  name: string;
  email: string;
  role: string;
  contactNumber: string;
  isMain: boolean;
  createAgain: boolean;
}

export interface IModalCreateNotificationConfiguration {
  setModal: (setModal: boolean) => void;
  buildingId: string;
  setBuilding: (setBuilding: IBuildingDetail) => void;
  setUsedMaintenancesCount: (setUsedMaintenancesCount: number) => void;
  setTotalMaintenancesCount: (setTotalMaintenancesCount: number) => void;
  phoneConfirmUrl: string;
  emailConfirmUrl: string;
}

// REQUESTS
export interface IRequestCreateNotificationConfiguration {
  values: ICreateNotificationConfiguration;
  buildingId: string;
  setOnQuery: (setOnQuery: boolean) => void;
  setModal: (setModal: boolean) => void;
  setBuilding: (setBuilding: IBuildingDetail) => void;
  setUsedMaintenancesCount: (setUsedMaintenancesCount: number) => void;
  setTotalMaintenancesCount: (setTotalMaintenancesCount: number) => void;
  phoneConfirmUrl: string;
  emailConfirmUrl: string;
  setFieldValue: any;
}
