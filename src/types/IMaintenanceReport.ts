import type { IAnnexesAndImages } from './IAnnexesAndImages';

export interface IMaintenanceReport {
  id?: string;
  cost?: string | number;
  observation?: string;
  ReportAnnexes?: IAnnexesAndImages[];
  ReportImages?: IAnnexesAndImages[];
}
