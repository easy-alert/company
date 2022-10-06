import { ITimeInterval } from '../../../../../../../../../utils/types';
import { IMaintenance, ICategories } from '../../../../../../utils/types';

export interface IModalEditMaintenance {
  selectedMaintenance: IMaintenance;
  timeIntervals: ITimeInterval[];
  categories: ICategories[];
  setCategories: (setCategories: ICategories[]) => void;
  categoryId: string;
  setModal: (setModal: boolean) => void;
}

export interface IRequestEditMaintenance {
  categoryId: string;
  maintenanceId: string;
  values: {
    element: string;
    activity: string;
    frequency: string;
    frequencyTimeInterval: string;
    responsible: string;
    source: string;
    period: string;
    periodTimeInterval: string;
    delay: string;
    delayTimeInterval: string;
    observation: string;
  };
  setOnQuery: (setOnQuery: boolean) => void;
  setModal: (setModal: boolean) => void;
  categories: ICategories[];
  setCategories: (setCategories: ICategories[]) => void;
}

export interface IDeleteMaintenance {
  categoryId: string;
  maintenanceId: string;
  setOnQuery: (setOnQuery: boolean) => void;
  setModal: (setModal: boolean) => void;
  categories: ICategories[];
  setCategories: (setCategories: ICategories[]) => void;
}
