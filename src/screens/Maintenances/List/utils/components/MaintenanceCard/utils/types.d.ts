import { ITimeInterval } from '../../../../../../../utils/types';
import { IMaintenance, ICategories } from '../../../types';

export interface IMaintenanceCard {
  maintenance: IMaintenance;
  timeIntervals: ITimeInterval[];
  categories: ICategories[];
  setCategories: (setCategories: ICategories[]) => void;
  categoryId: string;
}
