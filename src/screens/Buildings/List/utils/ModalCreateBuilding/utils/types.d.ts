interface ICreateBuilding {
  name: string;
  buildingTypeId: string;
  cep: string;
  city: string;
  state: string;
  neighborhood: string;
  streetName: string;
  area: string;
  deliveryDate: string;
  warrantyExpiration: string;
  keepNotificationAfterWarrantyEnds: boolean;
}

export interface IModalCreateBuilding {
  setModal: (setModal: boolean) => void;
}

// REQUESTS
export interface IRequestCreateBuilding {
  values: ICreateBuilding;
  setOnQuery: (setOnQuery: boolean) => void;
  setModal: (setModal: boolean) => void;
}
