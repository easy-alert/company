import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IResponse } from '@customTypes/IResponse';
import type { ITicket } from '@customTypes/ITicket';
import type { ITicketFilter } from '@screens/Tickets';

interface IGetTickets {
  filter?: ITicketFilter;
}

export const generateTicketReportPDF = async ({ filter }: IGetTickets) => {
  const params = {
    placesId: filter?.places?.length === 0 ? '' : filter?.places?.join(','),
    serviceTypesId: filter?.serviceTypes?.length === 0 ? '' : filter?.serviceTypes?.join(','),
    status: filter?.status?.length === 0 ? '' : filter?.status?.join(','),
    startDate: filter?.startDate,
    endDate: filter?.endDate,
    seen: filter?.seen,
  };

  const uri = `/tickets/report/pdf`;

  try {
    const response = await Api.post(uri, { params });
    console.log('🚀 ~ getTicketsByBuildingNanoId ~ response:', response);
  } catch (error: any) {
    handleToastify(error.response);
  }
};
