import { IAnnexesAndImages } from './IAnnexesAndImages';
import { IBuilding } from './IBuilding';
import { ICategory } from './ICategory';
import { IMaintenanceReport } from './IMaintenanceReport';
import { ISupplier } from './ISupplier';

export interface IMaintenancesStatus {
  name: 'expired' | 'pending' | 'completed' | 'overdue';
}

interface IMaintenanceData {
  id?: string;
  categoryId?: string;
  ownerCompanyId?: string;
  maintenanceTypeId?: string;

  element?: string;
  activity?: string;
  frequency?: number;
  frequencyTimeIntervalId?: string;
  responsible?: string;
  source?: string;
  period?: number;
  periodTimeIntervalId?: string;
  delay?: number;
  delayTimeIntervalId?: string;
  observation?: string;

  createdAt?: string;
  updatedAt?: string;

  Category?: ICategory;
  // OwnerCompany: ICompany;
  // BuildingsMaintenances: BuildingMaintenance[];

  FrequencyTimeInterval?: {
    name?: string;
    id?: string;
    pluralLabel?: string;
    singularLabel?: string;
    unitTime?: number;
  };
  PeriodTimeInterval?: {
    name?: string;
    id?: string;
    pluralLabel?: string;
    singularLabel?: string;
    unitTime?: number;
  };
  DelayTimeInterval?: {
    name?: string;
    id?: string;
    pluralLabel?: string;
    singularLabel?: string;
    unitTime?: number;
  };

  // MaintenancesHistory: IMaintenanceHistory[];
  // DefaultTemplateMaintenance: IDefaultTemplateMaintenance[];

  MaintenanceType?: {
    name?: string;
  };
  suggestedSuppliers?: ISupplier[];
  instructions?: {
    name?: string;
    url?: string;
  }[];

  hasHistory?: boolean;
  isSelected?: boolean;

  resolutionDate?: Date | null;
  notificationDate?: Date | null;
  maintenanceReport?: IMaintenanceReport;
  files?: IAnnexesAndImages[];
  images?: IAnnexesAndImages[];
  nextNotificationDate?: string;
  lastResolutionDate?: string;
  lastNotificationDate?: string;
  lastNotificationStatus?: string;
}

export interface IMaintenance {
  id: string;
  dueDate: string;
  resolutionDate: string;
  notificationDate: string;
  MaintenanceReport: IMaintenanceReport[];
  MaintenancesStatus: IMaintenancesStatus;
  Building: IBuilding;
  Maintenance: IMaintenanceData;
  canReport: boolean;
  inProgress: boolean;
  daysInAdvance: number;
  daysToAnticipate?: number;
}
