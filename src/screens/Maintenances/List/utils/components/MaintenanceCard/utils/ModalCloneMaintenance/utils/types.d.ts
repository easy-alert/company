import type { IPriority } from '@customTypes/IPriority';
import { ICategories, ICategoriesOptions, IMaintenance } from '../../../../../types';
import { ITimeInterval } from '../../../../../../../../../utils/types';

export interface IModalCloneMaintenance {
  categoryId: string;
  categories: ICategories[];
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
  timeIntervals: ITimeInterval[];
  setModal: (setModal: boolean) => void;
  maintenance: IMaintenance;
  categoriesOptions: ICategoriesOptions[];
  maintenancePriorities: IPriority[];
}

export interface IRequestCloneMaintenance {
  categories: ICategories[];
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
  setModal: (setModal: boolean) => void;
  setOnQuery: (setOnQuery: boolean) => void;
  maintenance: IMaintenance;

  values: {
    customCategoryId: string;
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
}
