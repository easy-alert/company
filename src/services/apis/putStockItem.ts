import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IStockItem } from '@customTypes/IStockItem';
import type { IServerMessage } from '@customTypes/IServerMessage';
import { uploadFile } from '@utils/functions';

interface IPostStockItem {
  id: string;
  name: string;
  description: string;
  unit: string;
  image?: string | File | null;
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
  imageUrl?: string;
  stockItemTypeId: string;
  isActive: boolean;
}

export async function putStockItem({
  id,
  name,
  description,
  unit,
  image,
  stockItemTypeId,
  isActive,
}: IPostStockItem) {
  const api = '/stock/items';

  let imageUrl: string | null = null;

  if (image && typeof image === 'object') {
    const { Location } = await uploadFile(image);
    imageUrl = Location;
  } else {
    imageUrl = image || '';
  }

  const body: IStockItemBody = {
    id,
    name,
    description,
    unit,
    imageUrl,
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
