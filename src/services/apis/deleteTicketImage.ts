import { Api } from '@services/api';
import { handleToastify } from '@utils/toastifyResponses';

interface IDeleteTicketImage {
  ticketId: string;
  imageId: string;
}

export const deleteTicketImage = async ({ ticketId, imageId }: IDeleteTicketImage) => {
  try {
    const response = await Api.delete(`/tickets/${ticketId}/images/${imageId}`);
    handleToastify(response);
    return response.data;
  } catch (error: any) {
    handleToastify(error.response);
    return null;
  }
};
