type IReportPdfStatus = 'pending' | 'finished' | 'failed';

export interface IReportPdf {
  id: string;

  name: string;
  url: string;
  authorId: string;
  authorCompanyId: string;
  status: IReportPdfStatus;

  createdAt: string;
  updatedAt: string;

  author?: {
    name: string;
  };
}
