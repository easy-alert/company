import type { IMaintenanceReportData } from '@screens/Reports/Maintenances/types';

export interface ISupplierMaintenanceHistory {
  maintenancesHistory: IMaintenanceReportData[];
  getMaintenanceHistory: () => void;
}
