interface MaintenanceCount {
  name: string;
  pluralLabel: string;
  singularLabel: string;
  count: number;
}

export interface IBuildingList {
  name: string;
  city: string;
  neighborhood: string;
  id: string;
  MaintenancesCount: MaintenanceCount[];
}

export interface IRequestBuildingList {
  setBuildingList: (setBuildingList: IBuildingList[]) => void;
  setLoading?: (setLoading: boolean) => void;
  setPage?: (setPage: number) => void;
  setCount: (setCount: number) => void;
  page: number;
  filter?: string;
  resetPage?: boolean;
}
