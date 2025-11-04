import { Api } from '@services/api';
import { handleToastify } from '@utils/toastifyResponses';
import type { ITicketChecklistItem } from '@customTypes/ITicketChecklistItem';

export async function moveTicketChecklistItem({
  itemId,
  direction,
}: {
  itemId: string;
  direction: 'up' | 'down';
}): Promise<ITicketChecklistItem[]> {
  const uri = `/tickets/checklist/${itemId}/move`;

  try {
    const response = await Api.patch(uri, { direction });
    handleToastify(response);
    return response.data.items as ITicketChecklistItem[];
  } catch (error: any) {
    handleToastify(error);
    throw error;
  }
}
