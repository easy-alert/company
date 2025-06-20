import type { IAnnexesAndImagesWithActivityId } from './IAnnexesAndImages';
import type { TMaintenanceHistoryActivityType } from './TMaintenanceHistoryActivityType';

export interface IMaintenanceHistoryActivity {
  id?: string;

  maintenanceHistoryId?: string;
  title?: string;
  content?: string | null;
  type: TMaintenanceHistoryActivityType;

  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string

  // maintenanceHistory: IMaintenanceHistory;
  images?: IAnnexesAndImagesWithActivityId[];
}
