import { IReportPdf } from '@customTypes/IReportPdf';
import { Api } from '@services/api';
import { catchHandler } from '@utils/functions';

interface IRequestUpdateReportName {
  reportId: string;
  reportType: 'ticket' | 'maintenance';
  reportName: string;
  onSuccess?: (report: IReportPdf) => void;
}

export const requestUpdateReportName = async ({
  reportId,
  reportType,
  reportName,
  onSuccess,
}: IRequestUpdateReportName) => {
  try {
    const response = await Api.put<IReportPdf>(`/report/${reportId}?reportType=${reportType}`, {
      reportName,
    });
    if (onSuccess) {
      onSuccess(response.data);
    }
  } catch (err) {
    catchHandler(err);
  }
};
