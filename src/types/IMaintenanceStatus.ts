export interface IMaintenanceStatus {
  id?: string;

  name?: string;
  singularLabel?: string;
  pluralLabel?: string;

  createdAt?: string;
  updatedAt?: string;

  MaintenancesHistory?: any[];
}
