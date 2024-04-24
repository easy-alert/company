import { IChecklistsForPDF, IFilter } from '../types';

export interface IModalPrintChecklists {
  setModal: (setModal: boolean) => void;
  checklistsForPDF: IChecklistsForPDF[];
  filterforPDF: IFilter;
  pendingCount: number;
  completedCount: number;
}
