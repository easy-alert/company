import { ITimeInterval } from '../../../../../../../utils/types';
import { IMaintenance, ICategories } from '../../../types';

export interface IMaintenanceCard {
  maintenance: IMaintenance;
  timeIntervals: ITimeInterval[];
  categories: ICategories[];
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
  categoryId: string;
}
