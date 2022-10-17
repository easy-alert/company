/* eslint-disable @typescript-eslint/no-explicit-any */

// MAINTENANCES
interface IMaintenance {
  id: string;
  maintenanceId: string;
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
  Maintenances: IMaintenance[];
}

// REQUESTS
export interface IRequestCategories {
  setLoading?: (setLoading: boolean) => void;
  setCategories: (setCategories: ICategories[]) => void;
  filter?: string;
}
