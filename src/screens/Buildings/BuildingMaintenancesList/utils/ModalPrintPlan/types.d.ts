import { AddedMaintenances } from '../types';

export interface IModalPrintPlan {
  setModal: (setModal: boolean) => void;
  categories: AddedMaintenances[];
}
