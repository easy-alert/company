// MAINTENANCES
interface IMaintenance {
  Maintenance: {
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
  };
}

export interface AddedMaintenances {
  Category: {
    id: string;
    name: string;
  };
  Maintenances: IMaintenance[];
  Building: {
    name: string;
  };
}

// REQUESTS
export interface IRequestAddedMaintenances {
  setLoading?: (setLoading: boolean) => void;
  setAddedMaintenances: (setAddedMaintenances: AddedMaintenances[]) => void;
  buildingId: string;
}
