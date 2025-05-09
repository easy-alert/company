import { Api } from '@services/api';
import { handleToastify } from '@utils/toastifyResponses';

interface IRequestUpdateReportName {
  reportId: string;
  reportType: 'ticket' | 'maintenance' | 'checklist';
  reportName: string;
}

export async function putReportPdf({ reportId, reportType, reportName }: IRequestUpdateReportName) {
  const uri = `/report/${reportId}?reportType=${reportType}`;
  const body = { reportName };

  try {
    const response = await Api.put(uri, body);

    handleToastify(response);
  } catch (error: any) {
    handleToastify(error.response);
  }
}
