import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IStock } from '@customTypes/IStock';

interface IGetStockById {
  stockId: string;
}

interface IGetStockByIdResponse {
  stock: IStock;
}

export async function getStockById({
  stockId,
}: IGetStockById): Promise<IGetStockByIdResponse | null> {
  const api = `/stock/inventory/details/${stockId}`;

  try {
    const response = await Api.get(api);

    return response.data as IGetStockByIdResponse;
  } catch (error: any) {
    handleToastify(error.response);

    return null;
  }
}
