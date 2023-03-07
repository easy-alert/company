// MAINTENANCES
interface IMaintenance {
  isSelected: boolean;
  id: string;
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
  ownerCompanyId: string | null;
  delay: number;
  DelayTimeInterval: {
    name: string;
    id: string;
    pluralLabel: string;
    singularLabel: string;
  };
  observation: string;
  resolutionDate?: string | null;
  notificationDate?: string | null;
  isSelected?: boolean;
}

export interface ICategories {
  id: string;
  name: string;
  ownerCompanyId: string | null;
  Maintenances: IMaintenance[];
}

// REQUESTS
export interface IRequestListCategoriesToManage {
  setLoading: (setLoading: boolean) => void;
  setTableLoading?: (setTableLoading: boolean) => void;
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
  buildingId: string;
  currentBuildingId: string;
  setBuildingName: React.Dispatch<React.SetStateAction<string>>;
}

// REQUESTS
export interface IRequestManageBuildingMaintenances {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigate: any;
  categories: ICategories[];
  buildingId: string;
  setOnQuery: (setOnQuery: boolean) => void;
}

export interface IBuildingListForSelect {
  id: string;
  name: string;
}
export interface IRequestBuildingListForSelect {
  buildingId: string;
  setBuildingListForSelect: (setBuildingListForSelect: IBuildingListForSelect[]) => void;
}
