import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

interface IDeleteStockItemType {
  id: string;
}

interface IDeleteStockItemTypeResponse {
  ServerResponse: string;
  stockItemType: {
    id: string;
    name: string;
  };
}

export async function deleteStockItemType({ id }: IDeleteStockItemType) {
  const api = `/stock/item-types/${id}`;

  try {
    const response = await Api.delete(api);

    handleToastify(response);

    return response.data as IDeleteStockItemTypeResponse;
  } catch (error: any) {
    handleToastify(error.response);

    return null;
  }
}
