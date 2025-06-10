import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

interface IGetMaintenanceReportProgress {
  maintenanceHistoryId: string;
}

export const getMaintenanceReportProgress = async ({
  maintenanceHistoryId,
}: IGetMaintenanceReportProgress) => {
  const uri = `/maintenances/list/report/progress/${maintenanceHistoryId}`;

  try {
    const response = await Api.get(uri);

    return response.data;
  } catch (error: any) {
    handleToastify(error.response, false);
    return {};
  }
};
