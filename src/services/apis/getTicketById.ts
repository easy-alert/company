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
    fieldsConfig?: Record<string, { hidden: boolean; required: boolean }>;
  };
}

export const getTicketById = async (ticketId: string) => {
  const uri = `/tickets/${ticketId}`;

  try {
    const response: IResponseGetTicketById = await Api.get(uri);

    const { ticket, fieldsConfig } = response.data;

    return { ticket, fieldsConfig };
  } catch (error: any) {
    handleToastify(error);
    return {} as ITicket;
  }
};
