import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IResponse } from '@customTypes/IResponse';
import type { ITicketDismissReason } from '@customTypes/ITicketDismissReason';

interface IResponseGetAllTicketDismissReasons extends IResponse {
  data: ITicketDismissReason[];
}

export const getAllTicketDismissReasons = async () => {
  const uri = '/ticketDismissReasons';

  try {
    const response: IResponseGetAllTicketDismissReasons = await Api.get(uri);

    const ticketDismissReasons = response.data;

    return ticketDismissReasons;
  } catch (error: any) {
    handleToastify(error.response.data.ServerMessage);

    return [];
  }
};
