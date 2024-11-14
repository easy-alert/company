import type { ITicket } from './ITicket';

export interface ITicketActivity {
  id: string;

  ticketId: string;
  type: string;
  title: string;
  content: string;

  createdAt: string;
  updatedAt: string;

  ticket: ITicket;
  images: any[];
}
