import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IPriority } from '@customTypes/IPriority';

interface IGetPriority extends Response {
  data: {
    maintenancePriorities: IPriority[];
  };
}

export async function getPriority() {
  const api = '/priority';

  try {
    const response: IGetPriority = await Api.get(api);

    const { maintenancePriorities } = response.data;

    return maintenancePriorities;
  } catch (error: any) {
    handleToastify(error.response.data.ServerMessage);

    return [];
  }
}
