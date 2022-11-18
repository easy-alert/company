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
  setCategories: (setCategories: ICategories[]) => void;
  buildingId: string;
}

// REQUESTS
export interface IRequestManageBuildingMaintenances {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigate: any;
  categories: ICategories[];
  buildingId: string;
  setOnQuery: (setOnQuery: boolean) => void;
}
