import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

export async function updateMaintenanceAdditionalInformation({
  buildingId,
  maintenanceId,
  additionalInfo,
  userResponsibleId,
}: {
  buildingId: string;
  maintenanceId: string;
  additionalInfo: string;
  userResponsibleId: string;
}) {
  const uri = 'buildings/maintenance/additional-information';

  const body = {
    buildingId,
    maintenanceId,
    additionalInfo,
    userResponsibleId,
  };

  try {
    const response = await Api.put(uri, body);

    handleToastify(response);
  } catch (error: any) {
    handleToastify(error.response);
  }
}
