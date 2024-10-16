import { AnnexesAndImages } from './AnnexesAndImages';
import { IMaintenanceReport } from './IMaintenanceReport';

export interface IMaintenance {
  daysToAnticipate?: number;
  Maintenance: {
    instructions?: { name: string; url: string }[];
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
    maintenanceReport?: IMaintenanceReport;
    files?: AnnexesAndImages[];
    images?: AnnexesAndImages[];
    nextNotificationDate?: string;
    lastResolutionDate?: string;
    lastNotificationDate?: string;
    lastNotificationStatus?: string;
  };
}
