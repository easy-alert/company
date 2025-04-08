export interface MaintenanceCategoriesResponse {
  totalMaintenances: number;
  totalCost: number;
  categoriesArray: Array<{
    category: string;
    count: number;
  }>;
}

export interface MaintenanceStatus {
  data: number[];
  labels: string[];
  colors: string[];
}

export interface UserActivity {
  usersActivitiesArray: string[];
  name: string;
  maintenanceHistoryCount: number;
  ticketCount: number;
  checklistCount: number;
  totalActivities: number;
}
