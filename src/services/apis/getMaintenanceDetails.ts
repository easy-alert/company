import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

export interface IRequestMaintenanceDetails {
  maintenanceHistoryId: string;
}

export const getMaintenanceDetails = async ({
  maintenanceHistoryId,
}: IRequestMaintenanceDetails) => {
  const uri = `/maintenances/list/details/${maintenanceHistoryId}`;

  try {
    const response = await Api.get(uri);

    return response.data;
  } catch (error: any) {
    handleToastify(error.response, false);

    return {};
  }
};
