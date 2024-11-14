// GLOBAL API
import { Api } from '@services/api';

// GLOBAL UTILS
import { handleToastify } from '@utils/toastifyResponses';

// GLOBAL TYPES
import type { IResponse } from '@customTypes/IResponse';
import type { ITicket } from '@customTypes/ITicket';

interface IResponseGetTicketById extends IResponse {
  data: {
    ticket: ITicket;
  };
}

export const getTicketById = async (ticketId: string) => {
  const uri = `/tickets/${ticketId}`;

  try {
    const response: IResponseGetTicketById = await Api.get(uri);

    const { ticket } = response.data;

    return ticket;
  } catch (error: any) {
    handleToastify(error);
    return {} as ITicket;
  }
};
