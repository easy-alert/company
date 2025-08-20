import { Api } from '@services/api';
import { handleToastify } from '@utils/toastifyResponses';

interface IDeleteTicket {
  ticketId: string;
}

export async function deleteTicketById({ ticketId }: IDeleteTicket) {
  const uri = `tickets/${ticketId}`;

  try {
    const response = await Api.delete(uri);

    handleToastify(response);

    return response.data;
  } catch (error: any) {
    handleToastify(error?.response);

    return null;
  }
}
