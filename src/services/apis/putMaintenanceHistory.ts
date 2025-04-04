import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

export async function putMaintenanceHistory(updatedMaintenance: any) {
  const uri = `/maintenances/history/edit`;

  const body = {
    ...updatedMaintenance,
  };

  try {
    const response = await Api.put(uri, body);

    handleToastify(response);
  } catch (error: any) {
    handleToastify(error.response);
  }
}
