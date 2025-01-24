export interface IModalCreateApartments {
  apartments?: {
    id: string;
    number: string;
    floor: string;
  }[];

  apartmentNumber: string;
  onQuery: boolean;

  handleChangeApartment: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddApartment: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleRemoveApartment: (index: number) => void;
  handleCreateApartment: () => void;
  handleCreateApartmentModal: (modalState: boolean) => void;
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
