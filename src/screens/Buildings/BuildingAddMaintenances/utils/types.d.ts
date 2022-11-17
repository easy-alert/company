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

interface IMaintenanceResData {
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

export interface ICategoryResData {
  id: string;
  name: string;
  ownerCompanyId: string | null;
  Maintenances: IMaintenanceResData[];
}

export interface ICategoriesResData {
  data: ICategoryResData[];
}

// REQUESTS
export interface IRequestCategories {
  setLoading: (setLoading: boolean) => void;
  setCategories: (setCategories: ICategories[]) => void;
  filter?: string;
}

// REQUESTS
export interface IRequestAddMaintenancesToBuilding {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigate: any;
  categories: ICategories[];
  buildingId: string;
  setOnQuery: (setOnQuery: boolean) => void;
}
