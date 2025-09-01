import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IStockMovement, IStockMovementForm } from '@customTypes/IStockMovements';
import type { IServerMessage } from '@customTypes/IServerMessage';

type IPostStockItem = IStockMovementForm;

interface IPostStockItemResponse {
  stockMovement: IStockMovement;
  ServerMessage: IServerMessage;
}

type IPostStockItemBody = IStockMovementForm;

export async function postStockMovement({
  stockId,
  movementType,
  quantity,
  transferToId,
}: IPostStockItem) {
  const api = '/stock/movements';

  const body: IPostStockItemBody = {
    stockId,
    movementType,
    quantity,
    transferToId,
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
