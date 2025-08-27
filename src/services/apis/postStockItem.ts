import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IStockItem } from '@customTypes/IStockItem';
import type { IServerMessage } from '@customTypes/IServerMessage';

interface IPostStockItem {
  name: string;
  description: string;
  unit: string;
  stockItemTypeId: string;
  isActive: boolean;
}

interface IPostStockItemResponse {
  stockItem: IStockItem;
  ServerMessage: IServerMessage;
}

export interface IStockItemBody {
  name: string;
  description?: string;
  unit: string;
  stockItemTypeId: string;
  isActive: boolean;
}

export async function postStockItem({
  name,
  description,
  unit,
  stockItemTypeId,
  isActive,
}: IPostStockItem) {
  const api = '/stock/items';

  const body: IStockItemBody = {
    name,
    description,
    unit,
    stockItemTypeId,
    isActive,
  };

  try {
    const response = await Api.post(api, body);

    handleToastify(response);

    return response.data as IPostStockItemResponse;
  } catch (error: any) {
    handleToastify(error.response);

    return null;
  }
}
