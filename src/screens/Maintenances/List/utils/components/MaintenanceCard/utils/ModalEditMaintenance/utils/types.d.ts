import type { IPriority } from '@customTypes/IPriority';
import { ITimeInterval } from '../../../../../../../../../utils/types';
import { IMaintenance, ICategories } from '../../../../../../utils/types';

export interface IModalEditMaintenance {
  selectedMaintenance: IMaintenance;
  timeIntervals: ITimeInterval[];
  categories: ICategories[];
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
  categoryId: string;
  setModal: (setModal: boolean) => void;
  maintenancePriorities: IPriority[];
}

export interface IRequestEditMaintenance {
  categoryId: string;
  maintenanceId: string;
  timeIntervals: ITimeInterval[];
  values: {
    isSelected: boolean;
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
    instructions: any;
    priorityName: string;
  };
  setOnQuery: (setOnQuery: boolean) => void;
  setModal: (setModal: boolean) => void;
  categories: ICategories[];
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
}

export interface IDeleteMaintenance {
  categoryId: string;
  maintenanceId: string;
  setOnQuery: (setOnQuery: boolean) => void;
  setModal: (setModal: boolean) => void;
  categories: ICategories[];
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
}
