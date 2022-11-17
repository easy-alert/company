import { IMaintenance, ICategories } from '../../../types';

export interface IMaintenanceCard {
  maintenance: IMaintenance;
  categories: ICategories[];
  setCategories: (setCategories: ICategories[]) => void;
  categoryIndex: number;
  maintenanceIndex: number;
}
