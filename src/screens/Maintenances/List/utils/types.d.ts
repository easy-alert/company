// MAINTENANCES
interface IMaintenance {
  hasHistory?: boolean;
  isSelected?: boolean;
  id: string;
  element: string;
  activity: string;
  frequency: number;
  FrequencyTimeInterval: {
    name: string;
    id: string;
    pluralLabel: string;
    singularLabel: string;
    unitTime: number;
  };
  responsible: string;
  source: string;
  period: number;
  PeriodTimeInterval: {
    name: string;
    id: string;
    pluralLabel: string;
    singularLabel: string;
    unitTime: number;
  };
  ownerCompanyId: string | null;
  delay: number;
  DelayTimeInterval: {
    name: string;
    id: string;
    pluralLabel: string;
    singularLabel: string;
    unitTime: number;
  };
  observation: string;
  resolutionDate?: Date | null;
  notificationDate?: Date | null;
  daysToAnticipate?: number;
  nextNotificationDate?: string;
  lastResolutionDate?: string;
  lastNotificationDate?: string;
  lastNotificationStatus?: string;
}

export interface ICategories {
  id: string;
  name: string;
  ownerCompanyId: string | null;
  Maintenances: IMaintenance[];
}

// REQUESTS
export interface IRequestCategories {
  setLoading?: (setLoading: boolean) => void;
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
  setCategoriesForFilter: React.Dispatch<React.SetStateAction<ICategories[]>>;
  filter?: string;
}

export interface ICategoriesOptions {
  name: string;
  id: string;
}

export interface IRequestCategoriesForSelect {
  setCategoriesOptions: React.Dispatch<React.SetStateAction<ICategoriesOptions[]>>;
}

export interface IFilterFunction {
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
  categoriesForFilter: ICategories[];
  filter: string;
}
