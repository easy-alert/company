import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IStockItem } from '@customTypes/IStockItem';
import type { IServerMessage } from '@customTypes/IServerMessage';

interface IPostStockItem {
  id: string;
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
  id: string;
  name: string;
  description?: string;
  unit: string;
  stockItemTypeId: string;
  isActive: boolean;
}

export async function putStockItem({
  id,
  name,
  description,
  unit,
  stockItemTypeId,
  isActive,
}: IPostStockItem) {
  const api = '/stock/items';

  const body: IStockItemBody = {
    id,
    name,
    description,
    unit,
    stockItemTypeId,
    isActive,
  };

  try {
    const response = await Api.put(api, body);

    handleToastify(response);

    return response.data as IPostStockItemResponse;
  } catch (error: any) {
    handleToastify(error.response);

    return null;
  }
}
