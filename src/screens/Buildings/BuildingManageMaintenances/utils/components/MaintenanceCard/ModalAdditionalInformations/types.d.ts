import { ICategories } from '../../../types';

export interface IModalAdditionalInformations {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
  maintenanceIndex: number;
  categoryIndex: number;
}

export interface IHandleAdditionalInformations {
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
  values: {
    hasLastResolutionDate: boolean;
    lastResolutionDate: string;
    hasFirstNotificationDate: boolean;
    firstNotificationDate: string;
  };
  maintenanceIndex: number;
  categoryIndex: number;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}
