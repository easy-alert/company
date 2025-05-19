// GLOBAL API
import { Api } from '@services/api';

// GLOBAL UTILS
import { handleToastify } from '@utils/toastifyResponses';

// GLOBAL TYPES
import type { IResponse } from '@customTypes/IResponse';
import type { IReportPdf } from '@customTypes/IReportPdf';

interface IResponseGetChecklistReports extends IResponse {
  data: {
    checklistPdfs: IReportPdf[];
  };
}

export const getChecklistReports = async () => {
  const uri = `/checklists/report/pdf`;

  try {
    const response: IResponseGetChecklistReports = await Api.get(uri);

    return response.data;
  } catch (error: any) {
    handleToastify(error);

    return {
      checklistPdfs: [],
    };
  }
};
