export interface IReportPdf {
  id: string;
  name: string;
  url: string | null;
  status: 'pending' | 'finished' | 'failed';
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
  };
  authorId: string;
  authorCompanyId: string;
}
