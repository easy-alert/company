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
  syndic: { name: string } | null;
  building: { name: string };
  status: 'pending' | 'completed';
  frequency: number | null;
  observation: string | null;
  user?: {
    name: string;
  };
  checklistItem: {
    id: string;
    name: string;
    status: 'pending' | 'completed';
  }[];
  images: {
    url: string;
    name: string;
  }[];
  detailImages: {
    url: string;
    name: string;
  }[];
}

export interface IFilterData {
  buildings: string[];
  status: string[];
  startDate: string;
  endDate: string;
}

export interface IChecklistFilterNames {
  buildingsNames: string;
  statusNames: string;
}

export interface ICounts {
  pending: number;
  inProgress: number;
  completed: number;
}
