interface ICreateNotificationConfiguration {
  name: string;
  email: string;
  role: string;
  contactNumber: string;
  isMain: boolean;
  showContact: boolean;
  createAgain: boolean;
}

interface IAutoCompleteData {
  customId: string;
  name: string;
  email: string;
  role: string;
  contactNumber: string;
}

export interface IModalCreateNotificationConfiguration {
  setModal: (setModal: boolean) => void;
  buildingId: string;
  phoneConfirmUrl: string;
  emailConfirmUrl: string;
  requestBuildingDetailsCall: () => Promise<void>;
}

// REQUESTS
export interface IRequestCreateNotificationConfiguration {
  values: ICreateNotificationConfiguration;
  buildingId: string;
  setOnQuery: (setOnQuery: boolean) => void;
  setModal: (setModal: boolean) => void;

  phoneConfirmUrl: string;
  emailConfirmUrl: string;
  setFieldValue: any;
  resetForm: any;
  requestBuildingDetailsCall: () => Promise<void>;
}
