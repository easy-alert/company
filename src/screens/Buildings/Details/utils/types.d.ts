export interface INotificationConfiguration {
  id: string;
  name: string;
  email: string;
  emailIsConfirmed: boolean;
  contactNumber: string;
  contactNumberIsConfirmed: boolean;
  role: string;
  isMain: boolean;
}

export interface IBuildingDetail {
  id: string;
  name: string;
  cep: string;
  city: string;
  state: string;
  neighborhood: string;
  streetName: string;
  area: string;
  deliveryDate: string;
  warrantyExpiration: string;
  keepNotificationAfterWarrantyEnds: boolean;
  BuildingType: {
    name: string;
    id: string;
  };
  NotificationsConfigurations: INotificationConfiguration[];
}

export interface IRequestBuildingDetails {
  setLoading?: (setLoading: boolean) => void;
  setBuilding: (setBuilding: IBuildingDetail) => void;
  buildingId: string;
  setUsedMaintenancesCount: (setUsedMaintenancesCount: number) => void;
  setTotalMaintenacesCount: (setTotalMaintenacesCount: number) => void;
}

export interface IRequestResendConfirmation {
  link: string;
  buildingNotificationConfigurationId: string;
}

export interface IRequestFileUpload {
  event: React.ChangeEvent<HTMLInputElement>;
}
