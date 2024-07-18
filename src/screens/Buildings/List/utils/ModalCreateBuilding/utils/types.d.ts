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
  mandatoryReportProof: boolean;
  nextMaintenanceCreationBasis: string;
  isActivityLogPublic: boolean;
}

export interface IModalCreateBuilding {
  setModal: (setModal: boolean) => void;
  buildingTypes: IBuildingTypes[];
}

// REQUESTS
export interface IRequestCreateBuilding {
  values: ICreateBuilding;
  setOnQuery: (setOnQuery: boolean) => void;
  setModal: (setModal: boolean) => void;
  navigate: any;
}
