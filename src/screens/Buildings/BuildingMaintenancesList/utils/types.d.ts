import { IMaintenanceReport } from '../../../Calendar/utils/ModalSendMaintenanceReport/types';
import { AnnexesAndImages } from '../../../Calendar/types';

// MAINTENANCES
export interface IMaintenance {
  Maintenance: {
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
    resolutionDate?: Date | null;
    notificationDate?: Date | null;
    maintenanceReport?: IMaintenanceReport;
    files?: AnnexesAndImages[];
    images?: AnnexesAndImages[];
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
  setAddedMaintenancesForFilter: (setAddedMaintenances: AddedMaintenances[]) => void;
  buildingId: string;
  setBuildingName: React.Dispatch<React.SetStateAction<string>>;
}

export interface IFilterFunction {
  setAddedMaintenances: React.Dispatch<React.SetStateAction<AddedMaintenances[]>>;
  addedMaintenancesForFilter: AddedMaintenances[];
  filter: string;
}
