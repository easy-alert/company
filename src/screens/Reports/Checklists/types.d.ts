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
  images: {
    url: string;
    name: string;
  }[];
}

export interface IChecklistsForPDF {
  month: string;
  data: IChecklists[];
}
