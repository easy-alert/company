export interface IReportsFilters {
  maintenanceStatusId: string;
  buildingId: string;
  categoryId: string;
  startDate: string;
  endDate: string;
}

export interface IFilterforPDF {
  buildingName: string;
  categoryName: string;
  status: string;
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
  activity: string;
  buildingName: string;
  categoryName: string;
  cost: number | null;
  element: string;
  maintenanceHistoryId: string;
  notificationDate: string;
  resolutionDate: string | null;
  responsible: string | null;
  status: 'completed' | 'expired' | 'pending' | 'overdue';
}

export interface IRequestReportsData {
  setOnQuery: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCounts: React.Dispatch<React.SetStateAction<ICounts>>;
  setMaintenances: React.Dispatch<React.SetStateAction<IMaintenanceRepor | undefined>>;
  filters: IReportsFilters;
}

export interface IRequestReportsDataForSelect {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setFiltersOptions: React.Dispatch<React.SetStateAction<IFiltersOptions | undefined>>;
}
