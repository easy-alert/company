import type { IUser } from '@customTypes/IUser';

export interface MaintenanceKanban {
  id: string;
  buildingName: string;
  element: string;
  activity: string;
  status: 'expired' | 'pending' | 'completed' | 'overdue';
  date: string;
  label: string;
  cantReportExpired?: boolean;
  type: 'common' | 'occasional' | 'checklist';
  inProgress: boolean;
  priorityLabel: string;
  priorityColor: string;
  priorityBackgroundColor: string;

  name?: string;
  checklistProgress?: string;
}

export interface IKanban {
  status: string;
  maintenances: MaintenanceKanban[];
}

export interface IFilterOptions {
  months: {
    monthNumber: string;
    label: string;
  }[];
  status: {
    name: string;
    label: string;
  }[];
  years: string[];
  categories: {
    name: string;
    id: string;
  }[];
}

export interface IFilter {
  months: string;
  status: string;
  years: string;
  categoryId: string;
  priorityName: string;
}

export interface IRequestSyndicKanban {
  syndicNanoId: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setFilterOptions: React.Dispatch<React.SetStateAction<IFilterOptions>>;
  setOnQuery: React.Dispatch<React.SetStateAction<boolean>>;
  filter: IFilter;
  setKanban: React.Dispatch<React.SetStateAction<IKanban[]>>;
  setBuildingName: React.Dispatch<React.SetStateAction<string>>;
}

export interface AnnexesAndImages {
  name: string;
  originalName: string;
  url: string;
}

export interface MaintenanceReport {
  id: string;
  cost: number;
  observation: string;
  ReportAnnexes: AnnexesAndImages[];
  ReportImages: AnnexesAndImages[];
}

export interface MaintenanceReportProgress {
  id: string;
  cost: number;
  observation: string;
  ReportAnnexesProgress: AnnexesAndImages[];
  ReportImagesProgress: AnnexesAndImages[];
}

export interface MaintenancesStatus {
  name: 'expired' | 'pending' | 'completed' | 'overdue';
}

export interface Building {
  name: string;
  guestCanCompleteMaintenance: boolean;
}

export interface Category {
  name: string;
}

export interface Maintenance {
  Category: Category;
  activity: string;
  element: string;
  observation: string;
  responsible: string;
  source: string;

  frequency: number;
  FrequencyTimeInterval: {
    pluralLabel: string;
    singularLabel: string;
  };

  MaintenanceType: {
    name: string;
  };

  instructions: { name: string; url: string }[];
}

export interface IMaintenance {
  id: string;
  dueDate: string;
  resolutionDate: string;
  notificationDate: string;
  MaintenanceReport: MaintenanceReport[];
  MaintenanceReportProgress: MaintenanceReportProgress[];
  MaintenancesStatus: MaintenancesStatus;
  Building: Building;
  Maintenance: Maintenance;
  canReport: boolean;
  inProgress: boolean;
  daysInAdvance: number;
  additionalInfo?: string;
  userResponsible?: IUser;
}

export interface IRequestMaintenanceDetails {
  maintenanceHistoryId: string;
}
