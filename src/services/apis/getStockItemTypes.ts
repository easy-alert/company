import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IStockItemType } from '@customTypes/IStockItemType';

interface IGetStockItemTypes {
  stockItemTypes: IStockItemType[];
  count: number;
}

export async function getStockItemTypes(): Promise<IGetStockItemTypes | null> {
  const api = '/stock/item-types';

  try {
    const response = await Api.get(api);

    return response.data as IGetStockItemTypes;
  } catch (error: any) {
    handleToastify(error.response);

    return null;
  }
}
