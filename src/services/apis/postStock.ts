import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IStock, IStockForm } from '@customTypes/IStock';
import type { IServerMessage } from '@customTypes/IServerMessage';

type IPostStock = IStockForm;

type IStockBody = IStockForm;

interface IPostStockResponse {
  stock: IStock;
  ServerMessage: IServerMessage;
}

export async function postStock({
  buildingId,
  quantity,
  minimumQuantity,
  location,
  notes,
  stockItemId,
  isActive,
}: IPostStock) {
  const api = '/stock/inventory';

  const body: IStockBody = {
    buildingId,
    quantity,
    minimumQuantity,
    location,
    notes,
    stockItemId,
    isActive,
  };

  try {
    const response = await Api.post(api, body);

    handleToastify(response);

    return response.data as IPostStockResponse;
  } catch (error: any) {
    handleToastify(error.response);

    return null;
  }
}
