import { ITicketsForPDF, IFilter } from '../types';

export interface IModalPrintTickets {
  setModal: (setModal: boolean) => void;
  ticketsForPDF: ITicketsForPDF[];
  filterforPDF: IFilter;
  openCount: number;
  finishedCount: number;
  awaitingToFinishCount: number;
}
