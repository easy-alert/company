import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IStockItem } from '@customTypes/IStockItem';

interface IGetStockItems {
  stockItems: IStockItem[];
  count: number;
}

export async function getStockItems(): Promise<IGetStockItems | null> {
  const api = '/stock/items';

  try {
    const response = await Api.get(api);

    return response.data as IGetStockItems;
  } catch (error: any) {
    handleToastify(error.response);

    return null;
  }
}
