export interface IReportsFilters {
  maintenanceStatusIds: string[];
  buildingIds: string[];
  categoryNames: string[];
  startDate: string;
  endDate: string;
  buildingNames: string[];
  maintenanceStatusNames: string[];
  filterBy: string;
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
  buildingNames: string[];
  maintenanceStatusIds: string[];
  maintenanceStatusNames: string[];
  categoryNames: string[];
  startDate: string;
  endDate: string;
  filterBy: string;
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
  source: string;
  maintenanceHistoryId: string;
  notificationDate: string;
  resolutionDate: string | null;
  dueDate: string;
  responsible: string | null;
  status: 'completed' | 'expired' | 'pending' | 'overdue';
  type: 'common' | 'occasional' | null;
  inProgress: boolean;
  maintenanceObservation: string | null;
  reportObservation: string | null;
  expectedDueDate?: string;
  expectedNotificationDate?: string;
  isFuture?: boolean;

  images: {
    url: string;
  }[];

  annexes: {
    url: string;
    name: string;
  }[];
}

export interface IMaintenanceForPDF {
  month: string;

  data: {
    id: string;
    maintenanceHistoryId: string;
    buildingName: string;
    categoryName: string;
    element: string;
    activity: string;
    responsible: string | null;
    notificationDate: string;
    resolutionDate: string | null;
    status: 'completed' | 'expired' | 'pending' | 'overdue';
    inProgress: boolean;
    cost: number | null;
    type: string | null;
    reportObservation: string | null;

    images: {
      url: string;
      base64?: string;
    }[];

    annexes: {
      url: string;
      name: string;
    }[];
  }[];
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
