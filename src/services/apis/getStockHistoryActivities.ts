import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IResponse } from '@customTypes/IResponse';
import type { IStockActivity } from '@customTypes/IStockActivity';

interface IResponseGetStockHistoryActivities extends IResponse {
  data: {
    stockActivities: IStockActivity[];
  };
}

interface IGetStockHistoryActivities {
  stockActivities: IStockActivity[];
}

export async function getStockHistoryActivities(
  stockId: string,
): Promise<IGetStockHistoryActivities> {
  const uri = `/stockHistoryActivities/${stockId}`;

  try {
    const response: IResponseGetStockHistoryActivities = await Api.get(uri);

    const { stockActivities } = response.data;

    return { stockActivities };
  } catch (error: any) {
    handleToastify(error.response);

    return { stockActivities: [] };
  }
}
