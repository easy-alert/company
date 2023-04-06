import { IMaintenanceReport } from '../../../Calendar/utils/ModalSendMaintenanceReport/types';
import { AnnexesAndImages } from '../../../Calendar/types';

// MAINTENANCES
interface IMaintenance {
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
}

export interface ICategories {
  id: string;
  name: string;
  ownerCompanyId: string | null;
  Maintenances: IMaintenance[];
}

// REQUESTS
export interface IRequestListCategoriesToManage {
  setLoading: (setLoading: boolean) => void;
  setTableLoading?: (setTableLoading: boolean) => void;
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
  buildingId: string;
  currentBuildingId: string;
  setBuildingName: React.Dispatch<React.SetStateAction<string>>;
}

// REQUESTS
export interface IRequestManageBuildingMaintenances {
  navigate: any;
  categories: ICategories[];
  buildingId: string;
  setOnQuery: (setOnQuery: boolean) => void;
}

export interface IBuildingListForSelect {
  id: string;
  name: string;
}
export interface IRequestBuildingListForSelect {
  buildingId: string;
  setBuildingListForSelect: (setBuildingListForSelect: IBuildingListForSelect[]) => void;
}

export interface ICategoriesOptions {
  name: string;
  id: string;
}

export interface IRequestCategoriesForSelect {
  setCategoriesOptions: React.Dispatch<React.SetStateAction<ICategoriesOptions[]>>;
}
