import type { IBuilding } from './IBuilding';
import type { IChecklistItem } from './IChecklistItem';
import type { IChecklistTemplate } from './IChecklistTemplate';
import type { IUser } from './IUser';

export type TChecklistStatus = 'pending' | 'inProgress' | 'completed';

export interface IChecklist {
  id?: string;

  buildingId?: string;
  syndicId?: string;
  userId?: string;
  templateId?: string;

  name?: string;
  description?: string;
  date?: string;
  resolutionDate?: string;
  frequency?: number;
  frequencyTimeIntervalId?: string;
  observation?: string;
  status?: TChecklistStatus;
  groupId?: string;

  createdAt?: string;
  updatedAt?: string;
  building?: IBuilding;
  user?: IUser;
  template?: IChecklistTemplate;

  checklistItem?: IChecklistItem[];
  images?: {
    id?: string;
    checklistId?: string;
    name?: string;
    url?: string;
  }[];
  // detailImages  ChecklistDetailImage[]
}
