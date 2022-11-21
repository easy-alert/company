import { IBuildingTypes } from '../../../../../../utils/types';
import { IBuildingDetail } from '../../types';

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
  buildingTypes: IBuildingTypes[];
  setUsedMaintenancesCount: (setUsedMaintenancesCount: number) => void;
  setTotalMaintenacesCount: (setTotalMaintenacesCount: number) => void;
}

// REQUESTS
export interface IRequestEditBuilding {
  values: IEditBuilding;
  setBuilding: (setBuilding: IBuildingDetail) => void;
  setOnQuery: (setOnQuery: boolean) => void;
  setModal: (setModal: boolean) => void;
  setUsedMaintenancesCount: (setUsedMaintenancesCount: number) => void;
  setTotalMaintenacesCount: (setTotalMaintenacesCount: number) => void;
}

export interface IRequestDeleteBuilding {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigate: any;
  setOnQuery: (setOnQuery: boolean) => void;
  setModal: (setModal: boolean) => void;
  buildingId: string;
}
