import { IMaintenanceReport, IFilterforPDF } from '../types';

export interface IModalPrintQRCode {
  setModal: (setModal: boolean) => void;
  maintenances: IMaintenanceReport[];
  filterforPDF: IFilterforPDF;
}
