import type { IChecklistTemplateItem } from './IChecklistTemplateItem';

export interface IChecklistTemplate {
  id?: string;

  buildingId?: string;

  name?: string;
  description?: string;
  items?: IChecklistTemplateItem[];

  createdAt?: string;
  updatedAt?: string;
}
