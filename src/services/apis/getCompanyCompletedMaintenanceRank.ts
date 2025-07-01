import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

export const getCompanyCompletedMaintenanceRank = async () => {
  const uri = 'home/rank/company/maintenances/completed';

  try {
    const response = await Api.get(uri);

    return response.data;
  } catch (error: any) {
    handleToastify(error.response);

    return {};
  }
};
