// GLOBAL API
import { Api } from '@services/api';

// GLOBAL UTILS
import { handleToastify } from '@utils/toastifyResponses';

// GLOBAL TYPES
import type { IResponse } from '@customTypes/IResponse';
import type { IReportPdf } from '@customTypes/IReportPdf';

interface IResponseGetTicketById extends IResponse {
  data: {
    ticketPdfs: IReportPdf[];
  };
}

export const getTicketReports = async () => {
  const uri = `/tickets/report/pdf`;

  try {
    const response: IResponseGetTicketById = await Api.get(uri);

    return response.data;
  } catch (error: any) {
    handleToastify(error);

    return {
      ticketPdfs: [],
    };
  }
};
