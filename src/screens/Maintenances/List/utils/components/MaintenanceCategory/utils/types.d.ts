/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IPriority } from '@customTypes/IPriority';
import { ICategories, ICategoriesOptions } from '../../../types';
import { ITimeInterval } from '../../../../../../../utils/types';

export interface IMaintenanceCategory {
  category: ICategories;
  categories: ICategories[];
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
  timeIntervals: ITimeInterval[];
  categoriesOptions: ICategoriesOptions[];
  maintenancePriorities: IPriority[];
}

export interface ISortType {
  type: 'none' | 'element' | 'activity' | 'frequency' | 'responsible' | 'source';
}

export interface ISortArray {
  category: ICategories;
  isSorted: boolean;
  setIsSorted: (setIsSorted: boolean) => void;
  toSortString: string;
  defaultSortedColumn?: boolean;
}
