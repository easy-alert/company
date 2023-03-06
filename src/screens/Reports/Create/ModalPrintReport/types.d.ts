import { IMaintenanceReport } from '../types';

export interface IModalPrintQRCode {
  setModal: (setModal: boolean) => void;
  maintenances: IMaintenanceReport[];
}
