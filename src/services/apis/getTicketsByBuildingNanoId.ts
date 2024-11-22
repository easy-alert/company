import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IResponse } from '@customTypes/IResponse';
import type { ITicket } from '@customTypes/ITicket';
import type { ITicketFilter } from '@screens/Tickets';

interface IGetTickets {
  buildingNanoId: string;
  filter?: ITicketFilter;
  page?: number;
  take?: number;
  count?: boolean | '';
}

interface IResponseGetTicketsByBuildingNanoId extends IResponse {
  data: {
    buildingName: string;
    tickets: ITicket[];
    ticketsCount: number;
    filterOptions: {
      years: string[];
      months: string[];
    };
  };
}

export const getTicketsByBuildingNanoId = async ({
  buildingNanoId,
  filter,
  page = 1,
  take = 10,
  count = '',
}: IGetTickets) => {
  const params = {
    year: filter?.year || '',
    month: filter?.month || '',
    status: filter?.status || '',
    placeId: filter?.places || '',
    serviceTypeId: filter?.serviceTypes || '',
    seen: filter?.seen,
    page,
    take,
    count,
  };

  const uri = `/tickets/buildings/${buildingNanoId}`;

  try {
    const response: IResponseGetTicketsByBuildingNanoId = await Api.get(uri, { params });

    const { buildingName, filterOptions, tickets, ticketsCount } = response.data;

    return { buildingName, filterOptions, tickets, ticketsCount };
  } catch (error: any) {
    handleToastify(error.response);
    return { buildingName: '', tickets: [], filterOptions: { years: [], months: [] } };
  }
};
