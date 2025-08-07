export interface ICalendarTicket {
  id: string;
  statusName: string;
  createdAt: string;
  building?: { name: string };
  types?: { type: { label: string } }[];
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
  buildings: ICalendarBuilding[];
}

export interface IGetCalendarTicketParams {
  companyId: string;
  year: number;
  month: number;
  buildingIds?: string[];
}
