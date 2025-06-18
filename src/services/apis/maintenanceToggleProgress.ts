import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

interface IMaintenanceToggleProgress {
  userId: string;
  maintenanceHistoryId: string;
  inProgressChange: boolean;
}

export const maintenanceToggleProgress = async ({
  userId,
  maintenanceHistoryId,
  inProgressChange,
}: IMaintenanceToggleProgress) => {
  const uri = `/maintenances/set/in-progress`;

  const body = {
    userId,
    maintenanceHistoryId,
    inProgressChange,
  };

  try {
    const response = await Api.post(uri, body);

    handleToastify(response);
  } catch (error: any) {
    handleToastify(error.response, false);
  }
};
