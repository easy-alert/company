import type { IStock } from './IStock';

export interface IStockActivity {
  id: string;

  stockId: string;
  type: string;
  title: string;
  content: string;

  createdAt: string;
  updatedAt: string;

  stock: IStock;
  images: any[];
}
