import { Api } from '@services/api';
import { handleToastify } from '@utils/toastifyResponses';

export async function deleteTicketChecklistItem({
  itemId,
  userId,
}: {
  itemId: string;
  userId?: string;
}) {
  const uri = `/tickets/checklist/${itemId}`;

  try {
    const response = await Api.delete(uri, { data: { userId } });
    handleToastify(response);
  } catch (error: any) {
    handleToastify(error);
    throw error;
  }
}
