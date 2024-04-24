import { IChecklistsForPDF, IFilterforPDF } from '../types';

export interface IModalPrintChecklists {
  setModal: (setModal: boolean) => void;
  checklistsForPDF: IChecklistsForPDF[];
  filterforPDF: IFilterforPDF;
  pendingCount: number;
  completedCount: number;
}
