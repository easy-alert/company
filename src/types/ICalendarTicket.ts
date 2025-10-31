export interface IAssistanceType {
  label: string;
  color?: string;
  backgroundColor?: string;
}

export interface ICalendarTicket {
  id: string;
  statusName: string;
  createdAt: string;
  building?: { name: string };
  place?: { label: string };
  ticketNumber?: string;
  types?: { type: IAssistanceType }[];
}

export interface ICalendarDay {
  date: string;
  tickets: ICalendarTicket[];
}

export interface ICalendarBuilding {
  id: string;
  name: string;
}

export interface IResponseGetCalendarTicket {
  Days: ICalendarDay[];
}

export interface IGetCalendarTicketParams {
  companyId: string;
  year: number;
  month?: number;
  buildingIds?: string[];
}

export interface ICalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  allDay: boolean;
  status: string;
  building?: string;
  place?: string;
  ticketNumber?: string;
  assistanceTypes?: IAssistanceType[];
  extendedProps?: {
    type: 'ticket' | 'maintenance';
    [key: string]: any;
  };
}
