import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

export async function putBuildingsApartments({
  buildingId,
  apartments,
}: {
  buildingId: string;
  apartments: {
    id?: string;
    number: string;
    floor?: string;
  }[];
}) {
  const uri = `buildings/apartments/${buildingId}`;

  const body = {
    apartments,
  };

  try {
    const response = await Api.put(uri, body);

    handleToastify(response);
  } catch (error: any) {
    handleToastify(error.response);
  }
}
