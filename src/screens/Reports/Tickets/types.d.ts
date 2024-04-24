export interface IFilter {
  buildingNames: string[];
  statusNames: string[];
  startDate: string;
  endDate: string;
}

interface Building {
  name: string;
}

interface Image {
  name: string;
  url: string;
}
interface Place {
  label: string;
}
interface Type {
  type: Place;
}
interface Status {
  name: string;
  label: string;
  color: string;
  backgroundColor: string;
}
interface ITicket {
  id: string;
  building: Building;
  description: string;
  images: Image[];
  place: Place;
  types: Type[];
  status: Status;
  createdAt: string;
  residentName: string;
  residentApartment: string;
}

export interface ITicketsForPDF {
  month: string;
  data: ITicket[];
}
