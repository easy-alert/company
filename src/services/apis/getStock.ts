import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IStock } from '@customTypes/IStock';

interface IGetStock {
  buildingIds: string[];
  stockItemTypesIds: string[];
  status: string[];
  search: string;
}

interface IGetStockResponse {
  stocks: IStock[];
  stocksCount: number;
}

export async function getStock({
  buildingIds,
  stockItemTypesIds,
  status,
  search,
}: IGetStock): Promise<IGetStockResponse | null> {
  const api = '/stock/inventory';

  const params = {
    buildingIds: buildingIds.length > 0 ? buildingIds.join(',') : undefined,
    stockItemTypesIds: stockItemTypesIds.length > 0 ? stockItemTypesIds.join(',') : undefined,
    status: status.length > 0 ? status.join(',') : undefined,
    search: search || undefined,
  };

  try {
    const response = await Api.get(api, { params });

    return response.data as IGetStockResponse;
  } catch (error: any) {
    handleToastify(error.response);

    return null;
  }
}
