import { Api } from '@services/api';
import { handleToastify } from '@utils/toastifyResponses';

interface IDeleteTicket {
  ticketId: string;
}

export async function deleteTicketById({ ticketId }: IDeleteTicket) {
  const uri = `tickets/${ticketId}`;

  try {
    const response = await Api.delete(uri);

    handleToastify({
      status: 200,
      data: response.data,
    });

    return response.data;
  } catch (error: any) {
    handleToastify(error.response);
    return null;
  }
}
