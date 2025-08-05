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

export interface IResponseGetCalendarCalled {
  Days: ICalendarDay[];
  buildings: ICalendarBuilding[];
}

export interface IGetCalendarCalledParams {
  companyId: string;
  year: number;
  buildingId?: string;
}
