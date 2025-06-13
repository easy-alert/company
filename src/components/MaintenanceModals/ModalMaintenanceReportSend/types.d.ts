import { TModalNames } from '@customTypes/TModalNames';

export interface IModalMaintenanceReportSend {
  maintenanceHistoryId: string;
  refresh: boolean;
  handleModals: (modal: TModalNames, modalState: boolean) => void;
  handleRefresh: () => void;
}
