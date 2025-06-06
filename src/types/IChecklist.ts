import type { IBuilding } from './IBuilding';
import type { IChecklistItem } from './IChecklistItem';
import type { IChecklistTemplate } from './IChecklistTemplate';
import type { IUser } from './IUser';

export type TChecklistStatus = 'pending' | 'inProgress' | 'completed';
export type TChecklistItemStatus = 'pending' | 'approved' | 'rejected';

export interface IChecklist {
  id?: string;

  buildingId?: string;
  templateId?: string;
  finishedById?: string;

  name?: string;
  description?: string;
  date?: string;
  resolutionDate?: string;
  frequency?: number;
  frequencyTimeIntervalId?: string;
  observation?: string;
  status?: TChecklistStatus;
  groupId?: string;
  building?: IBuilding;
  template?: IChecklistTemplate;

  createdAt?: string;
  updatedAt?: string;

  checklistItem?: IChecklistItem[];

  images?: {
    id?: string;
    checklistId?: string;
    name?: string;
    url?: string;
  }[];

  checklistUsers?: IUser[];

  finishedBy?: IUser;
}
