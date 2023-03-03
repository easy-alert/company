import { IMaintenance, ICategories } from '../../types';
import { ITimeInterval } from '../../../../../../utils/types';

export interface IMaintenanceCard {
  maintenance: IMaintenance;
  categories: ICategories[];
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
  categoryIndex: number;
  maintenanceIndex: number;
  toCopyBuilding: string;
  setToCopyBuilding: (setToCopyBuilding: string) => void;
  timeIntervals: ITimeInterval[];
  categoryId: string;
}
