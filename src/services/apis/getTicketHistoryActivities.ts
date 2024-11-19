import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IResponse } from '@customTypes/IResponse';
import type { ITicketActivity } from '@customTypes/ITicketActivity';

interface IResponseGetTicketHistoryActivities extends IResponse {
  data: {
    ticketActivities: ITicketActivity[];
  };
}

interface IGetTicketHistoryActivities {
  ticketActivities: ITicketActivity[];
}

export async function getTicketHistoryActivities(
  ticketId: string,
  userId?: string,
  syndicNanoId?: string,
): Promise<IGetTicketHistoryActivities> {
  const uri = `/ticketHistoryActivities/${ticketId}`;

  const params = {
    syndicNanoId,
    userId,
  };

  try {
    const response: IResponseGetTicketHistoryActivities = await Api.get(uri, { params });

    const { ticketActivities } = response.data;

    return { ticketActivities };
  } catch (error: any) {
    handleToastify(error.response);

    return { ticketActivities: [] };
  }
}
