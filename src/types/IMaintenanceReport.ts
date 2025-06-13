import type { IAnnexesAndImages } from './IAnnexesAndImages';

export interface IMaintenanceReport {
  id?: string;

  cost?: string | number;
  observation?: string;

  ReportAnnexes?: IAnnexesAndImages[];
  ReportImages?: IAnnexesAndImages[];
}

export interface IMaintenanceReportProgress {
  id?: string;

  cost?: string | number;
  observation?: string;

  ReportAnnexesProgress?: IAnnexesAndImages[];
  ReportImagesProgress?: IAnnexesAndImages[];
}
