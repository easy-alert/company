import { Api } from '@services/api';
import { handleToastify } from '@utils/toastifyResponses';

interface IPostTicketImage {
  ticketId: string;
  file: File;
}

export const postTicketImage = async ({ ticketId, file }: IPostTicketImage) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const uploadResponse = await Api.post('/upload/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const { Location, originalname } = uploadResponse.data;
    const response = await Api.post(`/tickets/${ticketId}/images`, {
      url: Location,
      name: originalname,
    });

    handleToastify(response);
    return response.data;
  } catch (error: any) {
    handleToastify(error.response);
    return null;
  }
};
