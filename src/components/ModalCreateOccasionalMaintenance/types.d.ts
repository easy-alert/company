import type { IBuilding } from '@customTypes/IBuilding';
import type { ICategory } from '@customTypes/ICategory';

export interface IOccasionalMaintenanceData {
  buildingId: string;

  element: string;
  activity: string;
  responsible: string;
  executionDate: string;

  inProgress: boolean;

  categoryData: {
    id: string;
    name: string;
  };

  reportData: {
    cost: string;
    observation: string;
    files: IAnnexesAndImages[];
    images: IAnnexesAndImages[];
  };
}

export interface IRequestCreateOccasionalMaintenance {
  data: ICreateOccasionalMaintenanceData;
  origin: string;
  setModal: (setModal: boolean) => void;
  setOnQuery: (setOnQuery: boolean) => void;
  getCalendarData: () => Promise<void>;
}

export interface IModalCreateOccasionalMaintenance {
  handleGetCalendarData: () => Promise<void>;
  handleModalCreateOccasionalMaintenance: (modalState: boolean) => void;
  checklistTitle?: string;
  checklistBuildingId?: string;
}

export interface IModalFirstView {
  handleSetView: (setView: number) => void;
}

export interface IHandleSetOccasionalMaintenanceData {
  primaryKey: keyof IOccasionalMaintenanceData;
  value: string | number | boolean | object;
  secondaryKey?: string;
}

export interface IModalSecondView {
  buildingsData: IBuilding[];
  categoriesData: ICategory[];
  occasionalMaintenanceData: IOccasionalMaintenanceData;
  handleSetOccasionalMaintenanceData: (data: IHandleSetOccasionalMaintenanceData) => void;
  handleCreateOccasionalMaintenance: () => Promise<void>;
}
