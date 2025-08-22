import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

interface IDeleteStock {
  id: string;
}

interface IDeleteStockResponse {
  ServerResponse: string;

  stock: {
    id: string;

    stockItem: {
      id: string;
      name: string;
    };

    building: {
      id: string;
      name: string;
    };
  };
}

export async function deleteStock({ id }: IDeleteStock) {
  const api = `/stock/inventory/${id}`;

  try {
    const response = await Api.delete(api);

    handleToastify(response);

    return response.data as IDeleteStockResponse;
  } catch (error: any) {
    handleToastify(error.response);

    return null;
  }
}
