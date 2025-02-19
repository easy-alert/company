import type { TChecklistStatus } from './IChecklist';

export interface IChecklistItem {
  id?: string;

  templateId?: string;

  name?: string;
  description?: string;
  status?: TChecklistStatus;

  createdAt?: string;
  updatedAt?: string;
}
