import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { ITicketFilter } from '@screens/Reports/Tickets';

interface IGenerateTicketReportPDF {
  filter: ITicketFilter;
}

export const generateTicketReportPDF = async ({ filter }: IGenerateTicketReportPDF) => {
  const body = {
    buildingsNanoId: filter?.buildings.length === 0 ? '' : filter?.buildings?.join(','),
    placesId: filter?.places?.length === 0 ? '' : filter?.places?.join(','),
    serviceTypesId: filter?.serviceTypes?.length === 0 ? '' : filter?.serviceTypes?.join(','),
    status: filter?.status?.length === 0 ? '' : filter?.status?.join(','),
    startDate: filter?.startDate,
    endDate: filter?.endDate,
    seen: filter?.seen,
  };

  const uri = `/tickets/report/pdf`;

  try {
    const response = await Api.post(uri, body);
    console.log('🚀 ~ getTicketsByBuildingNanoId ~ response:', response);
  } catch (error: any) {
    handleToastify(error.response);
  }
};
