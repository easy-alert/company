import type { IPriority } from '@customTypes/IPriority';
import { ITimeInterval } from '../../../../../../../utils/types';
import { IMaintenance, ICategories, ICategoriesOptions } from '../../../types';

export interface IMaintenanceCard {
  maintenance: IMaintenance;
  timeIntervals: ITimeInterval[];
  categories: ICategories[];
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
  categoryId: string;
  categoriesOptions: ICategoriesOptions[];
  maintenancePriorities: IPriority[];
}
