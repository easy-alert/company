export interface IFilter {
  buildingNames: string[];
  statusNames: string[];
  startDate: string;
  endDate: string;
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
  observation: string | null;
  images: {
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
    }[];

    annexes: {
      url: string;
      name: string;
    }[];
  }[];
}
