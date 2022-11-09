interface IEditBuilding {
  id: string;
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

export interface IModalEditBuilding {
  setModal: (setModal: boolean) => void;
  setBuilding: (setBuilding: IBuildingDetail) => void;
  building: IBuildingDetail;
}

// REQUESTS
export interface IRequestEditBuilding {
  values: IEditBuilding;
  setBuilding: (setBuilding: IBuildingDetail) => void;
  setOnQuery: (setOnQuery: boolean) => void;
  setModal: (setModal: boolean) => void;
}
