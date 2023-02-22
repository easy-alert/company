import { IBuildingList } from '../../types';
import { IBuildingTypes } from '../../../../../../utils/types';

interface ICreateBuilding {
  name: string;
  buildingTypeId: string;
  cep: string;
  city: string;
  state: string;
  neighborhood: string;
  streetName: string;
  deliveryDate: string;
  warrantyExpiration: string;
  keepNotificationAfterWarrantyEnds: boolean;
}

export interface IModalCreateBuilding {
  setModal: (setModal: boolean) => void;
  page: number;
  setBuildingList: (setBuildingList: IBuildingList[]) => void;
  setCount: (setCount: number) => void;
  buildingTypes: IBuildingTypes[];
}

// REQUESTS
export interface IRequestCreateBuilding {
  values: ICreateBuilding;
  setOnQuery: (setOnQuery: boolean) => void;
  setModal: (setModal: boolean) => void;
  page: number;
  setBuildingList: (setBuildingList: IBuildingList[]) => void;
  setCount: (setCount: number) => void;
}
