import type { ICategory } from '@customTypes/ICategory';
import type { IAnnexesAndImages } from '@customTypes/IAnnexesAndImages';
import type { IPriority } from '@customTypes/IPriority';
import type { IBuildingForSelect } from '@customTypes/IBuildingForSelect';
import type { IUser } from '@customTypes/IUser';
import type { TPriorityName } from '@customTypes/TPriorityName';
import type { TResponsible } from '@customTypes/IResponsible';

export type IOccasionalMaintenanceType = 'pending' | 'finished' | '';

export interface IOccasionalMaintenanceData {
  buildingId: string;

  element: string;
  activity: string;
  responsible: TResponsible;
  executionDate: string;

  inProgress: boolean;

  priorityName: TPriorityName;

  usersId?: string[];

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
  buildingsForSelect: IBuildingForSelect[];

  handleModalCreateOccasionalMaintenance: (modalState: boolean) => void;

  handleMaintenanceHistoryIdChange?: (id: string) => void;

  handleModalMaintenanceDetails?: (modalState: boolean) => void;
  handleModalSendMaintenanceReport?: (modalState: boolean) => void;

  handleGetBackgroundData?: () => Promise<void>;

  externalBuildingId?: string;

  checklistActivity?: string;

  handleResetTickets?: () => void;
  ticketsIds?: string[];
  ticketsToAnswer?: string;
}

export interface IHandleCreateOccasionalMaintenance {
  occasionalMaintenanceType: IOccasionalMaintenanceType;
  inProgress?: boolean;
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
  buildingsForSelect: IBuildingForSelect[];
  usersForSelect: IUser[];
  categoriesData: ICategory[];
  priorityData: IPriority[];
  occasionalMaintenanceData: IOccasionalMaintenanceData;
  externalBuildingId?: string;
  checklistActivity?: string;
  handleSetView: (setView: number) => void;
  handleOccasionalMaintenanceDataChange: (data: IHandleSetOccasionalMaintenanceData) => void;
  handleCreateOccasionalMaintenance: (data: IHandleCreateOccasionalMaintenance) => Promise<void>;
}
export interface IModalThirdView {
  occasionalMaintenanceData: IOccasionalMaintenanceData;
  handleOccasionalMaintenanceDataChange: (data: IHandleSetOccasionalMaintenanceData) => void;
  handleSetView: (setView: number) => void;
  handleCreateOccasionalMaintenance: (data: IHandleCreateOccasionalMaintenance) => Promise<void>;
}
