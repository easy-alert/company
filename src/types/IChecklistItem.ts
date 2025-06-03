import type { TChecklistItemStatus } from './IChecklist';

export interface IChecklistItem {
  id?: string;

  templateId?: string;

  name?: string;
  description?: string;
  status?: TChecklistItemStatus;

  createdAt?: string;
  updatedAt?: string;
}
