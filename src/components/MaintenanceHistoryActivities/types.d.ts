import type { IMaintenanceHistoryActivity } from '@customTypes/IMaintenanceHistoryActivity';

export interface IMaintenanceHistoryActivities {
  maintenanceHistoryId: string;
  activities?: IMaintenanceHistoryActivity[];
  getActivities?: boolean;
  showTextArea?: boolean;
  refreshActivities?: boolean;
  handleRefresh?: () => void;
}

export interface IOccasionallyActivitiesImages extends File {
  path?: string;
  url?: string;
}

export interface IOccasionallyActivities {
  id: string;
  userId?: string;
  content: string;
  images: IOccasionallyActivitiesImages[];
  createdAt: string;
}

export interface IActivity {
  id: string;
  createdAt: string;
  title: string;
  content: string | null;
  type: 'comment' | 'notification';

  images: {
    id: string;
    url: string;
    name: string;
  }[];
}
