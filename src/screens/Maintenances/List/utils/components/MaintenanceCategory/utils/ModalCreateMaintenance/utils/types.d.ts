import { ICategories } from '../../../../../types';
import { ITimeInterval } from '../../../../../../../../../utils/types';

export interface IModalCreateMaintenance {
  categoryId: string;
  categories: ICategories[];
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
  timeIntervals: ITimeInterval[];
  setModal: (setModal: boolean) => void;
}

export interface IRequestCreateMaintenance {
  categories: ICategories[];
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
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
    createAgain: boolean;
  };
  setFieldValue: any;
  resetForm: any;
  defaultDelayIntervalId: string;
}
