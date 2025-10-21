import { Api } from '@services/api';
import { handleToastify } from '@utils/toastifyResponses';
import type { ITicketChecklistItem } from '@customTypes/ITicketChecklistItem';

export async function patchTicketChecklistItemToggle({
  itemId,
  userId,
}: {
  itemId: string;
  userId?: string;
}) {
  const uri = `/tickets/checklist/${itemId}`;

  try {
    const response = await Api.patch(uri, { userId });
    handleToastify(response);
    return response.data.item as ITicketChecklistItem;
  } catch (error: any) {
    handleToastify(error);
    throw error;
  }
}
