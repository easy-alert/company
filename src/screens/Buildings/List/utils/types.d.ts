interface MaintenanceCount {
  name: string;
  pluralLabel: string;
  singularLabel: string;
  count: number;
}

export interface IBuildingList {
  id: string;
  nanoId: string;
  name: string;
  city: string;
  neighborhood: string;
  createdAt: Date;
  MaintenanceScore: number;
  MaintenancesCount: MaintenanceCount[];
  ticketsCount: number;
}

export interface IRequestBuildingList {
  setBuildingList: (setBuildingList: IBuildingList[]) => void;
  setLoading?: (setLoading: boolean) => void;
  setPage?: (setPage: number) => void;
  setCount: (setCount: number) => void;
  filterType?: string;
  page: number;
  filter?: string;
  resetPage?: boolean;
}
