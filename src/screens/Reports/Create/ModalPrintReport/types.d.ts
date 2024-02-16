import { IMaintenanceForPDF, IFilterforPDF } from '../types';

export interface IModalPrintQRCode {
  setModal: (setModal: boolean) => void;
  maintenancesForPDF: IMaintenanceForPDF[];
  filterforPDF: IFilterforPDF;
}
