import { IBuildingTypes } from '../../../../../../utils/types';
import { IBuildingDetail } from '../../../types';

interface IEditBuilding {
  id: string;
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

export interface IModalEditBuilding {
  setModal: (setModal: boolean) => void;
  building: IBuildingDetail;
  buildingTypes: IBuildingTypes[];
  requestBuildingDetailsCall: () => Promise<void>;
}

// REQUESTS
export interface IRequestEditBuilding {
  values: IEditBuilding;
  setOnQuery: (setOnQuery: boolean) => void;
  setModal: (setModal: boolean) => void;
  requestBuildingDetailsCall: () => Promise<void>;
}

export interface IRequestDeleteBuilding {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigate: any;
  setOnQuery: (setOnQuery: boolean) => void;
  setModal: (setModal: boolean) => void;
  buildingId: string;
}
