import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { ITicketFilter, ITicketFilterNames } from '@screens/Reports/Tickets';

interface IGenerateTicketReportPDF {
  filter: ITicketFilter;
  filterNames: ITicketFilterNames;
}

export const generateTicketReportPDF = async ({
  filter,
  filterNames,
}: IGenerateTicketReportPDF) => {
  const body = {
    buildingsId: filter?.buildings.length === 0 ? '' : filter?.buildings?.join(','),
    buildingsNames: filterNames?.buildingsNames,
    placesId: filter?.places?.length === 0 ? '' : filter?.places?.join(','),
    placesNames: filterNames?.placesNames,
    serviceTypesId: filter?.serviceTypes?.length === 0 ? '' : filter?.serviceTypes?.join(','),
    serviceTypesNames: filterNames?.serviceTypesNames,
    status: filter?.status?.length === 0 ? '' : filter?.status?.join(','),
    statusNames: filterNames?.statusNames,
    startDate: filter?.startDate,
    endDate: filter?.endDate,
    seen: filter?.seen,
  };

  const uri = `/tickets/report/pdf`;

  try {
    const response = await Api.post(uri, body);

    handleToastify(response);
  } catch (error: any) {
    handleToastify(error.response);
  }
};
