export interface IReportsFilters {
  maintenanceStatusIds: string[];
  buildingIds: string[];
  startDate: string;
  endDate: string;
}

export interface IFilterforPDF {
  buildingNames: string;
  statusNames: string;
  startDate: string;
  endDate: string;
}

export interface IFilterforRequest {
  buildingIds: string[];
  maintenanceStatusIds: string[];
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
  status: IFilterStatus[];
}

export interface ICounts {
  completed: number;
  expired: number;
  pending: number;
  totalCost: number;
}

export interface IChecklists {
  id: string;
  name: string;
  description: string;
  date: string;
  syndic: { name: string };
  building: { name: string };
  status: 'pending' | 'completed';
  frequency: number | null;
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
  setMaintenances: React.Dispatch<React.SetStateAction<IChecklists[]>>;
  setMaintenancesForPDF: React.Dispatch<React.SetStateAction<IMaintenanceForPDF[]>>;
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
