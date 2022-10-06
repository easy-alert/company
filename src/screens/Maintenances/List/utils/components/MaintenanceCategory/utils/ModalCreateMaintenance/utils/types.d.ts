import { ICategories } from '../../../../../types';
import { ITimeInterval } from '../../../../../../../../../utils/types';

export interface IModalCreateMaintenance {
  categoryId: string;
  categories: ICategories[];
  setCategories: (setCategories: ICategories[]) => void;
  timeIntervals: ITimeInterval[];
  setModal: (setModal: boolean) => void;
}

export interface IRequestCreateMaintenance {
  categories: ICategories[];
  setCategories: (setCategories: ICategories[]) => void;
  setModal: (setModal: boolean) => void;
  setOnQuery: (setOnQuery: boolean) => void;
  categoryId: string;
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
}
