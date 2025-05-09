import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import { IFilterData, IChecklistFilterNames } from '@screens/Reports/Checklists/types';

interface IGenerateChecklistReportPDF {
  filterData: IFilterData;
  filterNames: IChecklistFilterNames;
}

export const generateChecklistReportPDF = async ({
  filterData,
  filterNames,
}: IGenerateChecklistReportPDF) => {
  const body = {
    buildingsId: filterData?.buildings.length === 0 ? '' : filterData?.buildings?.join(','),
    buildingsNames: filterNames?.buildingsNames,
    status: filterData?.status?.length === 0 ? '' : filterData?.status?.join(','),
    statusNames: filterNames?.statusNames,
    startDate: filterData?.startDate,
    endDate: filterData?.endDate,
  };

  const uri = `/checklists/report/pdf`;

  try {
    const response = await Api.post(uri, body);

    handleToastify(response);
  } catch (error: any) {
    handleToastify(error.response);
  }
};
