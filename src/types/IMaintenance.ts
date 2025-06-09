import { Building } from '../screens/Maintenances/Kanban/types.d';
import type { IAnnexesAndImages } from './IAnnexesAndImages';
import type { IBuilding } from './IBuilding';
import type { ICategory } from './ICategory';
import type { IMaintenanceReport, IMaintenanceReportProgress } from './IMaintenanceReport';
import type { ISupplier } from './ISupplier';
import type { IUser } from './IUser';

export interface IMaintenancesStatus {
  name: 'expired' | 'pending' | 'completed' | 'overdue';
}

export interface IMaintenanceData {
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

  instructions?: {
    name?: string;
    url?: string;
  }[];

  hasHistory?: boolean;
  isSelected?: boolean;

  resolutionDate?: Date | null;
  notificationDate?: Date | null;

  maintenanceReport?: IMaintenanceReport;
  nextNotificationDate?: string;
  lastResolutionDate?: string;
  lastNotificationDate?: string;
  lastNotificationStatus?: string;

  suggestedSuppliers?: ISupplier[];

  files?: IAnnexesAndImages[];
  images?: IAnnexesAndImages[];
}

export interface IMaintenance {
  id?: string;

  priorityName?: string;
  additionalInfo?: string;
  daysInAdvance?: number;
  daysToAnticipate?: number;
  serviceOrderNumber?: number;

  inProgress?: boolean;
  canReport?: boolean;
  showToResident?: boolean;

  notificationDate?: string;
  dueDate?: string;
  resolutionDate?: string;

  Building?: IBuilding;

  Maintenance?: IMaintenanceData;
  MaintenancesStatus?: IMaintenancesStatus;
  MaintenanceReport?: IMaintenanceReport[];
  MaintenanceReportProgress?: IMaintenanceReportProgress[];

  userResponsible?: IUser;

  Users?: {
    User: IUser;
  }[];
}
