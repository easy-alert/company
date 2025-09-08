import type { IBuilding } from './IBuilding';
import type { IBuildingNotificationConfiguration } from './IBuildingNotificationConfiguration';
import type { ITicketDismissReason } from './ITicketDismissReason';

export type ITicketStatusNames = 'open' | 'awaitingToFinish' | 'finished' | 'dismissed';

export interface ITicketStatus {
  name: ITicketStatusNames;
  label?: string;
  backgroundColor?: string;
  color?: string;
}

export interface ITicketPlace {
  id: string;
  label: string;
}

export interface ITicketType {
  type: {
    id: string;
    name: string;
    label: string;
    singularLabel: string;
    pluralLabel: string;
    color: string;
    backgroundColor: string;
  };
}

export interface ITicketImage {
  id: string;
  name: string;
  ticketId: string;
  url: string;
  createAt: string;
  updateAt: string;
}

export interface ITicket {
  id: string;

  residentName?: string;
  residentPhone?: string;
  residentApartment?: string;
  residentEmail?: string;
  residentCPF?: string;

  description?: string;
  placeId?: string;
  statusName?: ITicketStatusNames;
  buildingId?: string;
  ticketNumber?: number;

  userId?: string;

  seen?: boolean;
  seenAt?: string;

  showToResident?: boolean;

  dismissReason?: string;
  dismissReasonName?: string;
  dismissObservation?: string;
  dismissedAt?: string;
  dismissedById?: string;

  collaborator?: string;
  signature?: string;

  createdAt?: string;
  updatedAt?: string;

  images?: ITicketImage[];
  status?: ITicketStatus;
  place?: ITicketPlace;
  types?: ITicketType[];
  building?: IBuilding;
  dismissReasons?: ITicketDismissReason;
  dismissedBy?: IBuildingNotificationConfiguration;

  editedFields?: string[];
  lastEditedAt?: string | Date;
}
