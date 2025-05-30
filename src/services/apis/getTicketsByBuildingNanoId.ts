import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IResponse } from '@customTypes/IResponse';
import type { ITicket } from '@customTypes/ITicket';
import type { ITicketFilter } from '@screens/Tickets';

interface IGetTickets {
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
  filter,
  page = 1,
  take = 10,
  count = '',
}: IGetTickets) => {
  const params = {
    buildingsId: filter?.buildings?.length === 0 ? '' : filter?.buildings?.join(','),
    placesId: filter?.places?.length === 0 ? '' : filter?.places?.join(','),
    serviceTypesId: filter?.serviceTypes?.length === 0 ? '' : filter?.serviceTypes?.join(','),
    apartmentsNames: filter?.apartments?.length === 0 ? '' : filter?.apartments?.join(','),
    status: filter?.status?.length === 0 ? '' : filter?.status?.join(','),
    startDate: filter?.startDate,
    endDate: filter?.endDate,
    seen: filter?.seen,
    page,
    take,
    count,
  };

  const uri = '/tickets/buildings';

  try {
    const response: IResponseGetTicketsByBuildingNanoId = await Api.get(uri, { params });

    const { buildingName, filterOptions, tickets, ticketsCount } = response.data;

    return { buildingName, filterOptions, tickets, ticketsCount };
  } catch (error: any) {
    handleToastify(error.response);

    return {
      statusCode: error?.response?.status,
      buildingName: '',
      tickets: [],
      filterOptions: { years: [], months: [] },
    };
  }
};
