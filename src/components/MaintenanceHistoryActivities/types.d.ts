export interface IMaintenanceHistoryActivities {
  maintenanceHistoryId?: string;
  maintenanceType?: 'occasional' | 'common';
}

export interface IAnnexesAndImages {
  originalName: string;
  url: string;
}

export interface IOccasionallyActivitiesImages extends File {
  path: string;
}

export interface IOccasionallyActivities {
  id: string;
  content: string;
  images: IOccasionallyActivitiesImages[];
  userId?: string;
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
