export interface IReportsFilters {
  maintenanceStatusIds: string[];
  buildingIds: string[];
  categoryNames: string[];
  startDate: string;
  endDate: string;
}

export interface IFilterforPDF {
  buildingNames: string;
  categoryNames: string;
  statusNames: string;
  startDate: string;
  endDate: string;
}

export interface IFilterforRequest {
  buildingIds: string[];
  maintenanceStatusIds: string[];
  categoryNames: string[];
  startDate: string;
  endDate: string;
}

interface IFilterData {
  id: string;
  name: string;
}

interface IFilterStatus extends IFilterData {
  singularLabel: string;
  pluralLabel: string;
}

export interface IFiltersOptions {
  buildings: IFilterData[];
  categories: IFilterData[];
  status: IFilterStatus[];
}

export interface ICounts {
  completed: number;
  expired: number;
  pending: number;
  totalCost: number;
}

export interface IMaintenanceReportData {
  id: string;
  activity: string;
  buildingName: string;
  categoryName: string;
  cost: number | null;
  element: string;
  maintenanceHistoryId: string;
  notificationDate: string;
  resolutionDate: string | null;
  observation: string | null;
  responsible: string | null;
  status: 'completed' | 'expired' | 'pending' | 'overdue';
  type: 'common' | 'occasional' | null;
}

export interface IRequestReportsData {
  setOnQuery: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCounts: React.Dispatch<React.SetStateAction<ICounts>>;
  setMaintenances: React.Dispatch<React.SetStateAction<IMaintenanceReportData[]>>;
  filters: IReportsFilters;
}

export interface IRequestReportsDataForSelect {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setFiltersOptions: React.Dispatch<React.SetStateAction<IFiltersOptions | undefined>>;
}

export interface IRequestDeleteMaintenanceHistory {
  maintenanceHistoryId: string;
  onThenRequest: () => Promise<void>;
  setOnModalQuery: React.Dispatch<React.SetStateAction<boolean>>;
  setModal: (setModal: boolean) => void;
}
