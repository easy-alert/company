export interface IImage {
  id: string;
  ticketId: string;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface IStatus {
  name: string;
  label: string;
  color: string;
  backgroundColor: string;
}

export interface IPlace {
  id: string;
  label: string;
}

export interface IType {
  type: IPlace;
}

export interface ITicket {
  id: string;
  residentName: string;
  residentApartment: string;
  residentEmail: string;
  description: string;
  placeId: string;
  statusName: string;
  buildingId: string;
  ticketNumber: number;
  createdAt: string;
  updatedAt: string;
  images: IImage[];
  status: IStatus;
  place: IPlace;
  types: IType[];
}

export interface IStatusOptions {
  name: string;
  label: string;
}

export interface ITicketsToAnswer {
  id: string;
  ticketNumber: number;
}

export interface IBuildingOptions {
  name: string;
  nanoId: string;
  id: string;
}
