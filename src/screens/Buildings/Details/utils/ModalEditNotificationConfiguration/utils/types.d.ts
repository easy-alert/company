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
}

// REQUESTS
export interface IRequestEditNotificationConfiguration {
  values: IEditNotificationConfiguration;
  buildingId: string;
  setOnQuery: (setOnQuery: boolean) => void;
  setModal: (setModal: boolean) => void;
}
