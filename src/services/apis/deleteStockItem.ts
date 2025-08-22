import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

interface IDeleteStockItem {
  id: string;
}

interface IDeleteStockItemResponse {
  ServerResponse: string;

  stockItem: {
    id: string;
    name: string;
  };
}

export async function deleteStockItem({ id }: IDeleteStockItem) {
  const api = `/stock/items/${id}`;

  try {
    const response = await Api.delete(api);

    handleToastify(response);

    return response.data as IDeleteStockItemResponse;
  } catch (error: any) {
    handleToastify(error.response);

    return null;
  }
}
