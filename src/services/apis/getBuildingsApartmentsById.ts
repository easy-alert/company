import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

export async function getBuildingsApartmentsById({ buildingId }: { buildingId: string }) {
  const uri = `buildings/apartments/${buildingId}`;

  try {
    const response = await Api.get(uri);

    return response.data;
  } catch (error: any) {
    handleToastify(error.response);

    return {
      buildingApartments: [],
    };
  }
}
