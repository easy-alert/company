import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IStockItemType } from '@customTypes/IStockItemType';
import type { IServerMessage } from '@customTypes/IServerMessage';

interface IPostStockItemType {
  name: string;
  description: string;
  isActive: boolean;
}

interface IPostStockItemTypeResponse {
  stockItemType: IStockItemType;
  ServerMessage: IServerMessage;
}

export interface IStockItemTypeBody {
  name: string;
  description?: string;
  isActive: boolean;
}

export async function postStockItemTypes({ name, description, isActive }: IPostStockItemType) {
  const api = '/stock/item-types';

  const body: IStockItemTypeBody = {
    name,
    description,
    isActive,
  };

  try {
    const response = await Api.post(api, body);

    handleToastify(response);

    return response.data as IPostStockItemTypeResponse;
  } catch (error: any) {
    handleToastify(error.response);

    return null;
  }
}
