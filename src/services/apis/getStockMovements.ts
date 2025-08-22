import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IStockMovement } from '@customTypes/IStockMovements';

interface IGetStockMovements {
  stockMovements: IStockMovement[];
  count: number;
}

export async function getStockMovements(): Promise<IGetStockMovements | null> {
  const api = '/stock/movements';

  try {
    const response = await Api.get(api);

    return response.data as IGetStockMovements;
  } catch (error: any) {
    handleToastify(error.response);

    return null;
  }
}
