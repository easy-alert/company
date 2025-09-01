import type { IStockItem } from './IStockItem';

export interface IStockItemType {
  id: string;

  name?: string;
  description?: string;
  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;

  stockItems?: IStockItem[];

  _count?: {
    stockItems?: number;
  };
}

export interface IStockItemTypeForm {
  name: string;
  description?: string;
  isActive: boolean;
}
