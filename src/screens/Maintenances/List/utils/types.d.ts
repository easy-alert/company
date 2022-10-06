/* eslint-disable @typescript-eslint/no-explicit-any */

// MAINTENANCES
interface IMaintenanceHistory {
  id: string;
  maintenanceId: string;
  element: string;
  activity: string;
  frequency: number;
  FrequencyTimeInterval: {
    name: string;
    id: string;
    pluralLabel: string;
    singularLabel: string;
  };
  responsible: string;
  source: string;
  period: number;
  PeriodTimeInterval: {
    name: string;
    id: string;
    pluralLabel: string;
    singularLabel: string;
  };
  delay: number;
  DelayTimeInterval: {
    name: string;
    id: string;
    pluralLabel: string;
    singularLabel: string;
  };
  observation: string;
  createdAt: string;
  updatedAt: string;
}
interface IMaintenance {
  id: string;
  element: string;
  MaintenancesHistory: IMaintenanceHistory[];
}
export interface ICategories {
  id: string;
  name: string;
  Maintenances: IMaintenance[];
}

// REQUESTS
export interface IRequestCategories {
  setLoading?: (setLoading: boolean) => void;
  setCategories: (setCategories: ICategories[]) => void;
  filter?: string;
}
