import { Api } from '@services/api';
import { handleToastify } from '@utils/toastifyResponses';
import type { ITicketChecklistItem } from '@customTypes/ITicketChecklistItem';

interface IBody {
  title: string;
  userId?: string;
}

export async function postTicketChecklistItem({
  ticketId,
  title,
  userId,
}: {
  ticketId: string;
  title: string;
  userId?: string;
}) {
  const uri = `/tickets/${ticketId}/checklist`;

  try {
    const response = await Api.post(uri, { title, userId } as IBody);
    handleToastify(response);
    return response.data.item as ITicketChecklistItem;
  } catch (error: any) {
    handleToastify(error);
    throw error;
  }
}
