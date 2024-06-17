import { IMaintenanceForPDF, IFilterforPDF, ICounts } from '../types';

export interface IModalPrintQRCode {
  setModal: (setModal: boolean) => void;
  maintenancesForPDF: IMaintenanceForPDF[];
  filterforPDF: IFilterforPDF;
  counts: ICounts;
  setMaintenancesForPDF: React.Dispatch<React.SetStateAction<IMaintenanceForPDF[]>>;
}
