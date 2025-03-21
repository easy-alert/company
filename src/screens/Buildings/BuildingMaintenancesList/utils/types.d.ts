import type { IUser } from '@customTypes/IUser';
import type { IMaintenanceReport } from '../../../Calendar/utils/ModalSendMaintenanceReport/types';
import type { AnnexesAndImages } from '../../../Calendar/types';

// MAINTENANCES
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
    priorityName: string;
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
    MaintenanceAdditionalInformation?: {
      information: string;
      user?: IUser;
    };
  };
}

export interface AddedMaintenances {
  id: string;

  buildingId: string;
  categoryId: string;

  Building: {
    id: string;
    nanoId: string;
    name: string;
  };
  Category: {
    id: string;
    name: string;
  };
  Maintenances: IMaintenance[];
}

export interface IHandleModals {
  modal: 'printCategoryQrCode' | 'additionalInformation';
  modalState: boolean;
}

// REQUESTS
export interface IRequestAddedMaintenances {
  setLoading?: (setLoading: boolean) => void;
  setAddedMaintenances: (setAddedMaintenances: AddedMaintenances[]) => void;
  setAddedMaintenancesForFilter: (setAddedMaintenances: AddedMaintenances[]) => void;
  buildingId: string;
  setBuildingName: React.Dispatch<React.SetStateAction<string>>;
}

export interface IFilterFunction {
  setAddedMaintenances: React.Dispatch<React.SetStateAction<AddedMaintenances[]>>;
  addedMaintenancesForFilter: AddedMaintenances[];
  filter: string;
}

export interface IHandleGetUsersResponsible {
  buildingId: string;
}
