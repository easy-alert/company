import type { IUser } from '@customTypes/IUser';
import type { AddedMaintenances, IMaintenance } from '../../../types';

export interface IMaintenanceCategory {
  data: AddedMaintenances;
  usersResponsible: { User: IUser }[];
  handleRefresh: () => void;
}

export interface ISortType {
  type: 'none' | 'element' | 'activity' | 'frequency' | 'responsible' | 'source';
}

export interface ISortArray {
  category: IMaintenance[];
  isSorted: boolean;
  setIsSorted: (setIsSorted: boolean) => void;
  toSortString: string;
  defaultSortedColumn?: boolean;
}
