// SERVICES
import { Api } from '@services/api';

// GLOBAL UTILS
import { handleToastify } from '@utils/toastifyResponses';

// GLOBAL TYPES
import { IAnnexesAndImages } from '@customTypes/IAnnexesAndImages';

interface IPostTicketHistoryActivity {
  ticketId: string;
  syndicNanoId: string;
  userId?: string;
  activityContent: string;
  activityImages: IAnnexesAndImages[];
}

export async function postTicketHistoryActivity({
  ticketId,
  syndicNanoId,
  activityContent,
  activityImages,
}: IPostTicketHistoryActivity) {
  const uri = `/ticketHistoryActivities/`;

  const body = {
    ticketId,
    syndicNanoId,
    activityContent,
    activityImages,
  };

  try {
    const response = await Api.post(uri, body);

    return response;
  } catch (error: any) {
    handleToastify(error.response);

    return { ticketActivities: [] };
  }
}
