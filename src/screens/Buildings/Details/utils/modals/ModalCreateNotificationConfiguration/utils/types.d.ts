import { IBuildingDetail } from '../../../types';

interface ICreateNotificationConfiguration {
  name: string;
  email: string;
  role: string;
  contactNumber: string;
  isMain: boolean;
}

export interface IModalCreateNotificationConfiguration {
  setModal: (setModal: boolean) => void;
  buildingId: string;
  setBuilding: (setBuilding: IBuildingDetail) => void;
}

// REQUESTS
export interface IRequestCreateNotificationConfiguration {
  values: ICreateNotificationConfiguration;
  buildingId: string;
  setOnQuery: (setOnQuery: boolean) => void;
  setModal: (setModal: boolean) => void;
  setBuilding: (setBuilding: IBuildingDetail) => void;
}
