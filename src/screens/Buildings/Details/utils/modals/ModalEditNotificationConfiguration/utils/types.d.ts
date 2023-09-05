import { INotificationConfiguration } from '../../../types';

interface IEditNotificationConfiguration {
  name: string;
  email: string;
  role: string;
  contactNumber: string;
  isMain: boolean;
  showContact: boolean;
}

export interface IModalEditNotificationConfiguration {
  setModal: (setModal: boolean) => void;
  buildingId: string;
  selectedNotificationRow: INotificationConfiguration;
  phoneConfirmUrl: string;
  emailConfirmUrl: string;
  requestBuildingDetailsCall: () => Promise<void>;
}

// REQUESTS
export interface IRequestEditNotificationConfiguration {
  values: IEditNotificationConfiguration;
  buildingId: string;
  buildingNotificationConfigurationId: string;
  setOnQuery: (setOnQuery: boolean) => void;
  setModal: (setModal: boolean) => void;
  phoneConfirmUrl: string;
  emailConfirmUrl: string;
  requestBuildingDetailsCall: () => Promise<void>;
}

export interface IRequestDeleteNotificationConfiguration {
  setOnQuery: (setOnQuery: boolean) => void;
  setModal: (setModal: boolean) => void;
  buildingNotificationConfigurationId: string;
  requestBuildingDetailsCall: () => Promise<void>;
}
